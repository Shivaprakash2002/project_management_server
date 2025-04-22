const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Admin', 'Viewer'] },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

const createUser = async (username, password, role) => {
  const user = new User({ username, password, role });
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = { createUser, findUserByUsername, getAllUsers };