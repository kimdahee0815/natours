const express = require('express');
const {
  getCheckoutSession,
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getUserBookings,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.use(protect);

router.get('/checkout-session/:tourID', getCheckoutSession);

router
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getAllBookings)
  .post(createBooking);

router
  .route('/users/:id')
  .get(protect, restrictTo('admin', 'lead-guide'), getUserBookings);

router
  .route('/:id')
  .get(protect, restrictTo('admin', 'lead-guide'), getBooking)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateBooking)
  .delete(deleteBooking);

module.exports = router;
