const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true },  
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
