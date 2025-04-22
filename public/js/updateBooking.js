/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateBooking = async (bookingId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/bookings/${bookingId}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Booking updated successfully!');
      location.assign('/manage-bookings');
    }
  } catch (err) {
    showAlert('error', err.response.data.message || 'Error updating booking!');
  }
};