const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNHANDELED EXCEPTION! SHUTTING DOWN!');
  process.exit(1);
});

require('dotenv').config();
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection successfull!');
  });

const port = process.env.PORT || 3001;
// START SERVER
const server = app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

// Unhandled Rejections.
process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDELED REJECTION! SHUTTING DOWN!');
  server.close(() => {
    process.exit(1);
  });
});
