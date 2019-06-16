require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const createJwt = (user) => {
  const { APP_SECRET } = process.env;

  const token = jwt.sign({
    userId: user.dataValues.userId,
    email: user.dataValues.email,
    userType: user.dataValues.userType
  },
  APP_SECRET,
  { expiresIn: '24h' });

  return token;
};

//add function to create new user (update 2 tables user+Js or user+co)

const validateUser = async (email, password) => {
  const user = await User.findOne({ where: { email }});
  if (!user) {
    throw new Error('invalid');
  }
  const validUser = await user.validPassword(password);
  if (!validUser) {
    throw new Error('invalid');
  }

  return createJwt(user);
}

module.exports = {
  createJwt,
  validateUser
};
