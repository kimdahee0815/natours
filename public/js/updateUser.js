/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateUser = async (userId, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User updated successfully!');
      location.assign('/manage-users');
    }
  } catch (err) {
    showAlert('error', 'Error while updating User!');
  }
};