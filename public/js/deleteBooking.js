/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/bookings/${id}`)

    if (res.data.status === 'success') {
      showAlert('success', 'Your Booking was deleted successfully!');
      location.assign('/my-tours');
    }
  } catch (err) {
    console.log(err);
    if(err.response){
      showAlert('error', err.response.data.message);
    }else {
      showAlert('error', 'You cannot delete this booking!');
    }
    
  }
};

