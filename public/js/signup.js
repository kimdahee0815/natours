import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    if(password !== passwordConfirm){
      showAlert('error', 'Passwords do not match!');
      return;
    }
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/'); // Redirect to the home page after successful signup
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
