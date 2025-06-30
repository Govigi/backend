const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  businessType: { type: String },
  address: { type: String },
  contact: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date}
});

module.exports = mongoose.model('user', userSchema);
