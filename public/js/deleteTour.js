/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteTour = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/tour/${id}`)

    if (res.data.status === 'success') {
      showAlert('success', 'This Tour was deleted successfully!');
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    if(err.response){
      showAlert('error', err.response.data.message);
    }else {
      showAlert('error', 'You cannot delete this review!');
    }
    
  }
};

