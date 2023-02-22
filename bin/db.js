const mongoose = require('mongoose');

const db = function () {
   mongoose
      .set('strictQuery', false)
      .connect(
         `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
      )
      .then(() => console.log('Connected to MongoDB database...'))
      .catch((err) => console.log('Could not connect to MongoDB, ', err));
};

module.exports = db;
