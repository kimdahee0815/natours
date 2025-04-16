const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('This user does not exist.', 400));
  }

  // Allow nested routes
  if (!req.body.user) req.body.user = req.user._id;
  next();
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, user, tourId } = req.body;
  const tour = await Tour.findById(tourId);
  const newReview = await Review.create({
    review,
    rating,
    tour: tour._id,
    user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const reviews = await Review.find({ user: id });

  if (!reviews) {
    return next(new AppError('This review does not exist.', 400));
  }

  res.status(200).render('manageReviews', {
    title: `Manage ${user.name}'s Reviews`,
    reviews,
  });
});

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
