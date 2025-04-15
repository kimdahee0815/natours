/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const updateReview = async (review, rating, reviewId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review, 
        rating, 
      },
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Updated your review Successfully!');

        location.assign('/my-reviews');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};