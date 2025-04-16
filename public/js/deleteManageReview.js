/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteManageReview = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/reviews/${id}`)

    if (res.data.status === 'success') {
      showAlert('success', 'This Review was deleted successfully!');
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

