const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getForgotPasswordForm,
  getAccount,
  //updateUserData,
  getManageTours,
  getManageUsers,
  getManageReviews,
  getManageBookings,
  getMyTours,
  getMyReviews,
  getUserBookings,
  getUserReviews,
  getUserAccount,
  updateUserReviews,
  getMyBilling,
} = require('../controllers/viewsController');
const {
  protect,
  isLoggedIn,
  restrictTo,
} = require('../controllers/authController');
// const { createBookingCheckout } = require('../controllers/bookingController');
const { alerts } = require('../controllers/viewsController');

const router = express.Router();

router.use(alerts);

router.get('/', /*createBookingCheckout, */ isLoggedIn, getOverview);
router.get(`/tour/:slug`, isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/forgot-password', isLoggedIn, getForgotPasswordForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);
router.get('/my-reviews', protect, getMyReviews);
router.get('/my-billing', protect, getMyBilling);

router.get(
  '/manage-tours',
  protect,
  restrictTo('admin', 'lead-guide'),
  getManageTours,
);
router.get('/manage-users', protect, restrictTo('admin'), getManageUsers);
router.get('/manage-reviews', protect, restrictTo('admin'), getManageReviews);
router.get(
  '/manage-bookings',
  protect,
  restrictTo('admin', 'lead-guide'),
  getManageBookings,
);

router
  .route('/bookings/users/:id')
  .get(protect, restrictTo('admin', 'lead-guide'), getUserBookings);

router
  .route('/reviews/users/:id')
  .get(protect, restrictTo('admin', 'lead-guide'), getUserReviews);

router.route('/users/:id').get(protect, restrictTo('admin'), getUserAccount);
router
  .route('/reviews/tours/:id')
  .get(protect, restrictTo('admin'), updateUserReviews);
// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
