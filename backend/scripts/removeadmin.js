const mongoose = require('mongoose');
const Admin = require('../models/AdminModel');
require("dotenv").config({path : "../.env"})
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
Admin.deleteMany({})
  .then(() => {
    console.log('All admins removed successfully.');
  })
  .catch((err) => {
    console.error('Error removing admins:', err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
