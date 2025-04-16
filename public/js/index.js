/* eslint-disable */
import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { signup } from './signup';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { deleteUser } from './deleteUser';
import { deleteBooking } from './deleteBooking';
import { createReview }  from './createReview';
import { updateReview }  from './updateReview';
import { deleteReview } from './deleteReview';
import { deleteManageReview } from './deleteManageReview';
import { deleteManageUser } from './deleteManageUser';
import { deleteManageTour } from './deleteManageTour';
import { deleteManageBooking } from './deleteManageBooking';
import { getUserBookings } from '../../controllers/bookingController';
import { getUserReviews } from '../../controllers/reviewController';
// DOM Elements

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const passwordResetForm = document.querySelector('.form--password-reset');
const resetNewPasswordForm = document.querySelector('.form--reset-new-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const deleteBookingBtn = document.getElementById('delete-booking');
const deleteManageBookingBtns = document.querySelectorAll('.delete-manage-booking');
const userDeleteForm = document.querySelector('.form-user-delete');
const uploadBtn = document.getElementById('photo');
const previewImg = document.getElementById('previewImg');
const createReviewForm = document.querySelector('.form-review');
const createReviewBtn = document.querySelector('.btn--create-review');
const updateReviewForm = document.querySelector('.form-review-update');
const updateReviewBtn = document.querySelector('.btn--update-review');
const deleteReviewBtn = document.getElementById('delete-review');
const deleteManageReviewBtns = document.querySelectorAll('.delete-manage-review')
const deleteManageTourBtns = document.querySelectorAll('.delete-tour');
const deleteManageUserBtns = document.querySelectorAll('.delete-manage-user')
const userBookingsBtn = document.getElementById('user-bookings')
const userReviewsBtn = document.getElementById('user-reviews');

//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  //console.log(locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--login').textContent = 'Logging in...';
    // Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    document.querySelector('.btn--login').textContent = 'Login';
  });
}

if(passwordResetForm) {
  passwordResetForm.addEventListener('submit',  async (e) => {
    e.preventDefault();
    document.querySelector('.btn--password-reset').textContent = 'Processing...';
    const email = document.getElementById('email').value;

    await forgotPassword(email);
    document.querySelector('.btn--password-reset').textContent = 'Reset Password';
  });
}

if (resetNewPasswordForm) {
  resetNewPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--reset-new-password').textContent = 'Processing...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const pathSegments = window.location.pathname.split('/');
    const token = pathSegments[pathSegments.length - 1];

    await resetPassword(token, password, passwordConfirm);
    document.querySelector('.btn--reset-new-password').textContent = 'Reset Password';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--signup').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.getElementById('role').value;
    await signup(name, email, password, passwordConfirm, role);
    document.querySelector('.btn--signup').textContent = 'Sign Up';

  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-userdata').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');
    document.querySelector('.btn--save-userdata').textContent = 'Save Settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    let currentPassword = document.getElementById('password-current').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if(userDeleteForm) {
  userDeleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--delete-account').textContent = 'Deleting...';
    const currentPassword = document.getElementById('delete-current-password').value;
    
    await deleteUser(currentPassword);
    document.querySelector('.btn--delete-account').textContent = 'Delete Account';
  });
}

if(createReviewForm){
  createReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { tourId } = createReviewBtn.dataset;
    document.querySelector('.btn--create-review').textContent = 'Creating...';
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;

    await createReview(review, rating, tourId);
    document.querySelector('.btn--create-review').textContent = 'Create Review';
  }
  );
}

if(updateReviewForm){
  updateReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--update-review').textContent = 'Updating...';
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const { reviewId } = updateReviewBtn.dataset;

    await updateReview(review, rating, reviewId);
    document.querySelector('.btn--update-review').textContent = 'Update Review';
  }
  );
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;

    await bookTour(tourId);
    e.target.textContent = 'Book tour now!';
  });
}

if(deleteReviewBtn){
  deleteReviewBtn.addEventListener('click',async (e) => {
    e.target.textContent = 'Deleting...';
    const { reviewId } = e.target.dataset;

    await deleteReview(reviewId);
    e.target.textContent = 'Delete Review';
  });
}

deleteManageReviewBtns.forEach(btn => {
  btn.addEventListener('click', async function (e) {
    const clickedButton = e.currentTarget;
    clickedButton.textContent = 'Deleting...';
    const { reviewId } = clickedButton.dataset;

    await deleteManageReview(reviewId);
    clickedButton.textContent = 'Delete Review';
  });
});

if(deleteBookingBtn){
  deleteBookingBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Deleting...';
    const { bookId } = e.target.dataset;

    await deleteBooking(bookId);
    e.target.textContent = 'Delete Booking';
  });
}

deleteManageTourBtns.forEach(btn => {
  btn.addEventListener('click', async function (e) {
    const clickedButton = e.currentTarget;
    clickedButton.textContent = 'Deleting...';
    const { tourId } = clickedButton.dataset;

    await deleteManageTour(tourId);
    clickedButton.textContent = 'Delete Tour';
  });
});

deleteManageBookingBtns.forEach(btn => {
  btn.addEventListener('click', async function (e) {
    const clickedButton = e.currentTarget;
    clickedButton.textContent = 'Deleting...';
    const { bookId } = clickedButton.dataset;

    await deleteManageBooking(bookId);
    clickedButton.textContent = 'Delete Booking';
  });
});

deleteManageUserBtns.forEach(btn => {
  btn.addEventListener('click', async function (e) {
    const clickedButton = e.currentTarget;
    clickedButton.textContent = 'Deleting...';
    const { userId } = clickedButton.dataset;

    await deleteManageUser(userId);
    clickedButton.textContent = 'Delete User';
  });
});

userBookingsBtn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...';
  const { userId } = e.target.dataset;

  getUserBookings(userId);
  e.target.textContent = 'User Bookings';
});

userReviewsBtn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...';
  const { userId } = e.target.dataset;

  getUserReviews(userId);
  e.target.textContent = 'User Reviews';
});


const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) showAlert('success', alertMessage, 10);

document.addEventListener('DOMContentLoaded', () => {
  if(uploadBtn) {
    uploadBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      previewImg.src = fileReader.result;
    };
    });
  }
});