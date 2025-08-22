/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 😯');
  console.log(err);
  console.log(err.name, err.message);
});
const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PW);
mongoose
  //   .connect(process.env.DB_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connection successful! 💕');
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 😯');
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('🖐🏻 SIGTERM RECEIVED. Shutting down gracefully!');
  server.close(() => {
    console.log('🆘 Process terminated!');
  });
});
