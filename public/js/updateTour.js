/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const updateTour = async (tourId, form) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${tourId}`,
      data: form
    });
    console.log(res)

    if (res.data.status === 'success') {
        showAlert('success', 'Updated the tour Successfully!');
        location.assign(`/manage-tours`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error while updating the tour!');
  }
};
