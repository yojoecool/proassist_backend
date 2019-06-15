require('dotenv').config();
const AWS = require('aws-sdk');
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
};

const getResumeStream = async (userId) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
  });

  const { BUCKET_NAME } = process.env;
  const params = { Bucket: BUCKET_NAME, Key: userId + '.pdf' };

  // make sure file exists
  await s3.headObject(params).promise();

  const fileStream = s3.getObject(params).createReadStream();
  return fileStream;
};

module.exports = {
  createJwt,
  validateUser,
  getResumeStream
};
