const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  region: String,
  address: { type: String, default: "Невідомо" },
  role: { type: String, default: "Користувач" }
});

// 👇 Уникнення OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);

