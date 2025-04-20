/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createTours = async (tourData) => {
  try {

    for (let [key, value] of tourData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data: tourData,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
      location.assign('/manage-tours');
    }
  } catch (err) {
    showAlert('error', 'Error Creating Tours!');
  }
};
