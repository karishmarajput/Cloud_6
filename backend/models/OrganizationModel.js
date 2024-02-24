const mongoose = require('mongoose');
const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  publicBool: {
    type: Boolean,
    default: true,
  },
});
const organisationSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false 
  },
  templates: [
    TemplateSchema
  ]
});

const Organisation = mongoose.model('Organisation', organisationSchema);
// const Template = mongoose.model('Template', templateSchema);
module.exports = Organisation;
