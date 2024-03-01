const mongoose = require('mongoose');
const userdata = require('../models/UserData');
require("dotenv").config({path : "../.env"})
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
userdata.deleteMany({})
  .then(() => {
    console.log('All User Data removed successfully.');
  })
  .catch((err) => {
    console.error('Error removing user data:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
