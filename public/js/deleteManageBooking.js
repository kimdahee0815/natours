/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteManageBooking = async (id) => {
  try {
    console.log(id);
    const res = await axios.delete(`/api/v1/bookings/${id}`)

    if (res.data.status === 'success') {
      showAlert('success', `This user's Booking was deleted successfully!`);
      location.reload(true);
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

