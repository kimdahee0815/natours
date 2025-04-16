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

router.get(
  '/manage-tours',
  restrictTo('admin', 'lead-guide'),
  protect,
  getManageTours,
);
router.get('/manage-users', restrictTo('admin'), protect, getManageUsers);
router.get('/manage-reviews', restrictTo('admin'), protect, getManageReviews);
router.get(
  '/manage-bookings',
  restrictTo('admin', 'lead-guide'),
  protect,
  getManageBookings,
);

// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
