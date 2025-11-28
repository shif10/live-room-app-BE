# backend-livroom

Backend API for the Livroom project, built with Node.js, TypeScript, Express, and Socket.IO.

## Features

* JWT authentication
* Real-time chat with Socket.IO
* File uploads to AWS S3
* Cron jobs for scheduled tasks

## Tech Stack

* Node.js + TypeScript
* Express.js
* MongoDB (Mongoose)
* Socket.IO
* AWS SDK (SES, S3)
* Multer & Multer-S3
* Node-cron

## Installation




1. Install dependencies:


npm install

2. Create a `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
```

3. Run the development server:


npm run dev


4. Production build:


npm run build
npm start


## Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Runs development server with nodemon |
| `npm run build` | Compiles TypeScript to JavaScript    |
| `npm start`     | Runs compiled production server      |


