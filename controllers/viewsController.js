/* eslint-disable no-undef */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your eamil for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  if (!tours) {
    next(new AppError('There are no tours. ', 400));
  }
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  let bookId = null;

  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;

    const bookings = await Booking.find({ user: req.user._id });

    const foundBooking = bookings.find(
      (booking) =>
        booking.tour._id.toString() === tour._id.toString() &&
        booking.paid === true,
    );
    bookId = foundBooking._id.toString();
  }

  if (!tour) {
    next(new AppError('There is no tour that you are looking for. ', 400));
  }

  // 2) Build template
  // 3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    bookId,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Password Reset',
  });
};

exports.getResetNewPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset New Password',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  //console.log(req.user.id);
  const bookings = await Booking.find({ user: req.user.id });
  if (bookings.length === 0) {
    res.status(200).render('overview', {
      title: 'My Tours',
      tours: [],
    });
  }
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  //console.log(tours);
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
    bookings,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find all Reviews
  const reviews = await Review.find({ user: req.user.id });
  if (reviews.length === 0) {
    res.status(200).render('reviewOverview', {
      title: 'My Reviews',
      reviews: [],
    });
  }

  // 2) Passing the reviews to the template
  res.status(200).render('reviewOverview', {
    title: 'My Reviews',
    reviews,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
