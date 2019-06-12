require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const createJwt = (user) => {
  const { APP_SECRET } = process.env;

  const token = jwt.sign({
    userId: user.dataValues.userId,
    email: user.dataValues.email,
    userType: user.dataValues.userType
  }, APP_SECRET, {
    expiresIn: '8h'
  });

  return token;
};

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
