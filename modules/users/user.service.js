'use strict';

const User = require('./user.model');

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findById(id) {
  return User.findById(id).select('-password');
}

async function createUser(data) {
  const user = new User(data);
  return user.save();
}

async function getAllUsers() {
  return User.find({ active: true }).select('-password').sort({ createdAt: -1 });
}

async function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
}

async function deleteUser(id) {
  return User.findByIdAndUpdate(id, { active: false }, { new: true });
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
