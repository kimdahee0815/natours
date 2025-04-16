/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const getUserBookings = async (id) => {
  try {
    await axios(`/api/v1/bookings/users/${id}`);

  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
