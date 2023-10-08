const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,          // Indicates if the user is a regular admin
  isSuperAdmin: Boolean,     // Indicates if the user is a super admin
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
