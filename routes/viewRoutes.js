const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getForgotPasswordForm,
  getResetNewPasswordForm,
  getAccount,
  updateUserData,
  getMyTours,
} = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');
// const { createBookingCheckout } = require('../controllers/bookingController');
const { alerts } = require('../controllers/viewsController');

const router = express.Router();

router.use(alerts);

router.get('/', /*createBookingCheckout, */ isLoggedIn, getOverview);
router.get(`/tour/:slug`, isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/forgotPassword', isLoggedIn, getForgotPasswordForm);
router.get('/resetPassword/:token', isLoggedIn, getResetNewPasswordForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
