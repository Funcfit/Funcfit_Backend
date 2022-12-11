const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for user
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username should be unique'],
  },
  email: {
    type: String,
    required: true
 },
 password: {
    type: String,
    required: true
 },
 user_type:{
  type: String,
  default: 'member',
  required: false
 }
},{
 timestamps: true,
 collection: 'users'
});

// Create model for user
const User = mongoose.model('user', UserSchema);

module.exports = User;