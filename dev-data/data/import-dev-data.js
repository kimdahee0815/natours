/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PW);
mongoose
  // .connect(process.env.DB_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((/*con*/) => {
    // console.log(con.connections);
    console.log('DB connection successful! 💕');
  });

//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);
//Import DATA into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    //console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete All data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    process.exit();
    // console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
//console.log(process.argv);
