/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      if (type === 'data') {
        showAlert('success', `${type.toUpperCase()} updated successfully!`);
        if (res.data.data.user.photo) {
          document.querySelector('.form__user-photo').src = res.data.data.user.photo;
        }
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
