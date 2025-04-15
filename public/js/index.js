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
const deleteBookingBtn = document.getElementById('delete-tour');
const userDeleteForm = document.querySelector('.form-user-delete');
const uploadBtn = document.getElementById('photo');
const previewImg = document.getElementById('previewImg');
const createReviewForm = document.querySelector('.form-review');
//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  //console.log(locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--login').textContent = 'Logging in...';
    // Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    document.querySelector('.btn--login').textContent = 'Login';
  });
}

if(passwordResetForm) {
  passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--password-reset').textContent = 'Processing...';
    const email = document.getElementById('email').value;

    forgotPassword(email);
    document.querySelector('.btn--password-reset').textContent = 'Reset Password';
  });
}

if (resetNewPasswordForm) {
  resetNewPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    document.querySelector('.btn--reset-new-password').textContent = 'Processing...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const pathSegments = window.location.pathname.split('/');
    const token = pathSegments[pathSegments.length - 1];

    resetPassword(token, password, passwordConfirm);
    document.querySelector('.btn--reset-new-password').textContent = 'Reset Password';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--signup').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const role = document.getElementById('role').value;
    signup(name, email, password, passwordConfirm, role);
    document.querySelector('.btn--signup').textContent = 'Sign Up';

  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-userdata').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
    document.querySelector('.btn--save-userdata').textContent = 'Save settings';
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
    document.querySelector('.btn--save-password').textContent = 'Save password';
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
    document.querySelector('.btn--create-review').textContent = 'Creating...';
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;

    await createReview(review, rating);
    document.querySelector('.btn--create-review').textContent = 'Create Review';
  }
  );
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    //console.log(tourId);
    bookTour(tourId);
  });
}

if(deleteBookingBtn){
  deleteBookingBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Deleting...';
    const { tourId } = e.target.dataset;

    deleteBooking(tourId);
    e.target.textContent = 'Delete Booking';
  });
}

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