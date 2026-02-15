'use strict';

const User = require('./user.model');

async function findByEmail(email) {
  return User.findOne({ email });
}

async function createUser(data) {
  const user = new User(data);
  return user.save();
}

module.exports = {
  findByEmail,
  createUser
};
