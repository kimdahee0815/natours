# Natours - Eco-Tour Booking App <img src="https://dahee-natours-project.s3.amazonaws.com/favicon.png" width="150" height="150" />

Natours is a dynamic and eco-friendly tour booking platform that allows users to explore and book eco-tours with ease. Built with modern technologies, this app provides a polished UI, secure authentication, and a smooth payment flow. Admins have powerful management tools and insights to oversee the platform.

## 🚀 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)  ![Stripe](https://img.shields.io/badge/Stripe-008C51?style=for-the-badge&logo=stripe&logoColor=white)  ![Mapbox](https://img.shields.io/badge/Mapbox-0083FF?style=for-the-badge&logo=mapbox&logoColor=white)  ![SendGrid](https://img.shields.io/badge/SendGrid-00B0A1?style=for-the-badge&logo=sendgrid&logoColor=white)  ![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)  ![Koyeb](https://img.shields.io/badge/Koyeb-1D72B8?style=for-the-badge&logo=koyeb&logoColor=white)

## 🌟 Key Features

- **💳 Stripe Payments**: Secure payments for booking tours.
- **📧 SendGrid Integration**: 
  - Welcome emails on user sign-up.
  - Password reset workflows.
- **🗺️ Mapbox Integration**: Interactive map to explore available tours.
- **☁️ AWS S3 Storage**: Scalable image uploads with proper CORS configuration.
- **🔐 JWT Authentication**: Secure user login with role-based access control.
- **🛠️ Admin Dashboard**: Admins can manage tours, users, reviews, and bookings.
- **📊 Billing Insights**: Visualizations for booking history, revenue analytics, and more (via AmCharts).
- **📱 Responsive UI**: Optimized for various devices and screen sizes.

## 🔐 Security Measures

- **🛡️ Helmet**: Sets secure HTTP headers to protect against common vulnerabilities.
- **⚡ Rate Limiting**: Prevents denial-of-service (DoS) attacks.
- **🧼 Data Sanitization**: Protects against malicious input using express-mongo-sanitize and xss-clean.
- **🚫 HPP Prevention**: Prevents HTTP Parameter Pollution (HPP) using HPP middleware.

## 🏗️ Architecture

- **MVC Structure**: The project follows a clean Model-View-Controller architecture for maintainability and scalability.
- **🖥️ Server-Side Rendering**: The frontend is built with Pug for server-side rendering (SSR), ensuring fast load times and SEO optimization.