const mongoose = require('mongoose');
const Tour = require('./tourModel');
// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty!'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'user', select: 'name photo' }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  this.populate('user').populate({
    path: 'tour',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
// same user can't write multipe reviews to one tour!
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  // console.log(this.review);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); doesn't work here, because query has already been executed
  this.review.constructor.calcAverageRatings(this.review.tour);
});

reviewSchema.post('save', function () {
  // this keyword points to current review
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
