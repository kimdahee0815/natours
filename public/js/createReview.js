/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const createReview = async (review, rating, tourId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review, 
        rating, 
        tourId,
      },
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Created your review Successfully!');

        location.reload(true);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
