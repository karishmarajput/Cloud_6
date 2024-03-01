const mongoose = require('mongoose');
const template = require('../models/template');
require("dotenv").config({path : "../.env"})
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
template.deleteMany({})
  .then(() => {
    console.log('All templates removed successfully.');
  })
  .catch((err) => {
    console.error('Error removing template:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
