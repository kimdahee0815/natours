/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteUser = async (currentPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/deleteMe',
      data: {
        currentPassword,
      },
    });

    console.log(res.data)
    if (res.data.status === 'success') {
      showAlert('success', 'Your Account is inactive now! It will be deleted in 30 days!');
      document.cookie = 'jwt=; path=/;';
      location.assign('/');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

