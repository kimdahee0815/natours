/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      if (res.data.data.activeUser === true) {
        showAlert('success', 'Your account has been activated again!');
      } else {
        showAlert('success', 'Logged In Successfully!');
      }

      location.assign('/');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    //console.log(res);
    if (res.data.status === 'success') {
      // true makes it possible to reload from server, not from cache
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
