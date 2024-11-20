const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModal');
require('dotenv').config();

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Connection successfull!');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
); // Convert into JSON Format

// IMPORT DATA INTO DB :
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded successfully!');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// console.log(process.argv);

