const mongoose = require('mongoose');
const Organization = require('../models/OrganizationModel');
require("dotenv").config({path : "../.env"})
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
Organization.deleteMany({})
  .then(() => {
    console.log('All organization removed successfully.');
  })
  .catch((err) => {
    console.error('Error removing organization:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
