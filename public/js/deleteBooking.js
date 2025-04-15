/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteBooking = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/bookings/${id}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your Booking was deleted successfully!');
      location.assign('/mytours');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

