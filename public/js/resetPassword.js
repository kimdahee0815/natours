/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    console.log(token, password, passwordConfirm)
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      if(res.data.data.activeUser === true) {
        showAlert('success', 'Your account has been activated again!');
      }else{
        showAlert('success', 'Password Reset Successfully!');
      }
      location.assign('/');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

