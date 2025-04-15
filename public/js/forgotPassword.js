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
    //console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Password Reset Email was sent!');
      location.assign('/');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

