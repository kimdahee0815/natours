/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm, role) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      location.assign('/'); // Redirect to the home page after successful signup
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
