const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('City', CitySchema);