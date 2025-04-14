// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const pug = require('pug');
// eslint-disable-next-line import/no-extraneous-dependencies
const { htmlToText } = require('html-to-text');
// new Email(user, url).sendWelcome();
const path = require('path');
const sgMail = require('@sendgrid/mail')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Dahee Kim <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Active in gmail "less secure app" option
    });
  }

  async send(template, subject) {
    // Send the actual email
    // 1) Render HTML based on a pug template

    const pugFilePath = path.resolve(
      __dirname,
      `../views/email/${template}.pug`,
    );

    const html = pug.renderFile(pugFilePath, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };
    // 3) Create a transport and send email
    if (process.env.NODE_ENV === 'development') {
      await this.newTransport().sendMail(mailOptions);
    }else if(process.env.NODE_ENV === 'production'){
      // Send email with SendGrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      sgMail
        .send(mailOptions)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    }

  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
