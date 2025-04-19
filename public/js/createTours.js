/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const createTour = async (tourData) => {
  try {
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

document.querySelector('.form--create-tour').addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData();

  // Basic tour info
  form.append('name', document.getElementById('name').value);
  form.append('duration', document.getElementById('duration').value);
  form.append('maxGroupSize', document.getElementById('maxGroupSize').value);
  form.append('difficulty', document.getElementById('difficulty').value);
  form.append('price', document.getElementById('price').value);
  form.append('summary', document.getElementById('summary').value);
  form.append('description', document.getElementById('description').value);

  // Start location
  const startLocation = {
    type: 'Point',
    coordinates: document.getElementById('coordinates').value.split(',').map(Number),
    address: document.getElementById('address').value,
    description: document.getElementById('description-loc').value
  };
  form.append('startLocation', JSON.stringify(startLocation));

  // Images
  const imageCover = document.getElementById('imageCover').files[0];
  const images = document.getElementById('images').files;
  
  form.append('imageCover', imageCover);
  Array.from(images).forEach(img => form.append('images', img));

  // Create tour
  createTour(form);
});

// Add location button handler
document.getElementById('add-location').addEventListener('click', () => {
  // Add new location inputs logic here
});

// Add date button handler
document.getElementById('add-date').addEventListener('click', () => {
  // Add new date input logic here
});