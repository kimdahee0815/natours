/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const createReview = async (review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review, 
        rating, 
      },
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Created your review Successfully!');

        location.assign('/');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    //console.log(res);
    if (res.data.status === 'success') {
      // true makes it possible to reload from server, not from cache
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
