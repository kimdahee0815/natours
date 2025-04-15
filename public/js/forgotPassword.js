/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      if(res.data.data.activeUser){
        showAlert('success', 'Your inactive account password Reset Email was sent!');
      }else {
        showAlert('success', 'Password Reset Email was sent!');
      }
    
      location.assign('/login');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

