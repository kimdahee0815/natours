/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteManageUser = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/users/${id.toString()}`)

    if (res.data.status === 'success') {
      showAlert('success', 'This Account was deleted successfully!');
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

