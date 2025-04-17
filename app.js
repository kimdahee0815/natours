const express = require('express');
const path = require('path');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require('express-mongo-sanitize');
// eslint-disable-next-line import/no-extraneous-dependencies
const xss = require('xss-clean');
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const { webhookCheckout } = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewares
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   }),
// );
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'default-src': ["'self'"],
    'style-src': [
      "'self'",
      'unsafe-inline',
      'https://dahee-natours-project.s3.amazonaws.com/',
      'http://localhost:8000',
      'https://fonts.googleapis.com',
      'https://unpkg.com',
      'https://api.mapbox.com',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'font-src': ['self', 'https://fonts.gstatic.com'],
    'script-src': [
      "'self'",
      'unsafe-inline',
      'data',
      'blob',
      'https://*.stripe.com',
      'https://*.mapbox.com',
      'https://*.cloudflare.com/',
      'https://bundle.js:8828',
      'https://unpkg.com',
      'http://localhost:8000',
      'https://cdn.jsdelivr.net',
      'https://dahee-natours-project.s3.amazonaws.com/',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'worker-src': [
      "'self'",
      'unsafe-inline',
      'data:',
      'blob:',
      'https://*.stripe.com',
      'https://*.mapbox.com',
      'https://*.cloudflare.com/',
      'https://bundle.js:*',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'frame-src': [
      "'self'",
      'unsafe-inline',
      'data:',
      'blob:',
      'https://*.stripe.com',
      'https://*.mapbox.com',
      'https://*.cloudflare.com/',
      'https://bundle.js:*',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'img-src': [
      "'self'",
      'unsafe-inline',
      'data:',
      'blob:',
      'https://*.stripe.com',
      'https://*.mapbox.com',
      'https://*.cloudflare.com/',
      'https://bundle.js:*',
      'http://localhost:8000',
      'https://dahee-natours-project.s3.amazonaws.com/',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'connect-src': [
      "'self'",
      'unsafe-inline',
      'data:',
      'blob:',
      'https://*.stripe.com',
      'https://*.mapbox.com',
      'https://*.cloudflare.com/',
      'https://bundle.js:*',
      'http://localhost:8000',
      'ws://localhost:58446/',
      'ws://localhost:1234/',
      'https://dahee-natours-project.s3.amazonaws.com/',
      'https://helpful-prawn-natours-dh-777b7d7d.koyeb.app/',
    ],
    'form-action': [
      "'self'",
      'https://dahee-natours-project.s3.amazonaws.com/',
    ],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
  }),
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  validate: { trustProxy: false },
});
app.use('/api', limiter);

// body shouldn't be json! if request hit body parser express.json, then body will be changed to json
// it needs to be raw form, not json
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

// app.engine('pug', require('pug').__express);
// app.set('view engine', 'pug');
// app.set('views', `${process.cwd()}/dev-data/templates`.replace(/\\/g, '/'));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser
app.use(cookieParser());

// Data sanitazation agains NoSQL Query Injection
app.use(mongoSanitize());

// Data sanitazation agains XSS(Cross Site Scripting Attacks)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
