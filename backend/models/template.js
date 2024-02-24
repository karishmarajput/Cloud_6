const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // url: {
  //   type: String,
  //   required: true,
  // },
  publicBool: {
    type: Boolean,
    default: true,
  },
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
