const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
