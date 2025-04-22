/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const { uploadToS3 } = require('../utils/s3');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-23749lakwnef234-3323423452.jpeg (user-userId-timestamp)
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an Image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  const processedImage = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  try {
    const url = await uploadToS3(
      processedImage,
      `users/${req.file.filename}`,
      'image/jpeg',
    );
    req.file.filename = url;
  } catch (err) {
    return next(new AppError('Error uploading to S3:', err));
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document only can update name and email
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //console.log(updatedUser);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { currentPassword } = req.body;
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  // 2) Check if posted password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect password!', 401));
  }

  // 3) If so, delete account (set active to false), Delete all associated data
  await Review.deleteMany({ user: req.user.id });
  await Booking.deleteMany({ user: req.user.id });

  // Remove user from tour guides if they are a guide
  await Tour.updateMany(
    { guides: req.user.id },
    { $pull: { guides: req.user.id } },
  );

  await User.findByIdAndUpdate(req.user.id, { active: false });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    //https
    secure: req.secure || req.get('x-forwarded-proto') === 'https',
    httpOnly: true,
  };

  res.cookie('jwt', '', cookieOptions);

  res.status(200).json({
    status: 'success',
    token: '',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userTobeDeleted = await User.findByIdAndDelete(req.params.id);

  if (!userTobeDeleted) {
    return next(new AppError('No User Found with that ID!', 404));
  }
  // Delete all associated data
  await Review.deleteMany({ user: req.params.id });
  await Booking.deleteMany({ user: req.params.id });

  // Remove user from tour guides if they are a guide
  await Tour.updateMany(
    { guides: req.params.id },
    { $pull: { guides: req.params.id } },
  );

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // Create a copy of req.body to avoid modifying the original
  const updateData = { ...req.body };

  // Handle photo update if a new file was uploaded
  if (req.file) {
    updateData.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
