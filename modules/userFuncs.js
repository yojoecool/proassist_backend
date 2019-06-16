require('dotenv').config();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { User, JobSeeker, Company, Admin } = require('../models');

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

const registerUser = async (fields) => {
  const emailAlreadyExists = await User.findOne({ where: { email: fields.email }});
  if (emailAlreadyExists) {
    throw new Error('email already exists');
  }

  const createUser = await User.create({
    password: fields.password,
    facebookId: "",
    email: fields.email,
    userType: fields.userType
  })

  switch(fields.userType) {
    case "JobSeeker":
      await JobSeeker.create({
        firstName: fields.firstName,
        lastName: fields.lastName,
        userId: createUser.userId
      })
      break;
    case "Company":
      const poc = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.pocEmail,
        phoneNumber: fields.phoneNumber
      }
      await Company.create({
        name: fields.companyName,
        poc,
        userId: createUser.userId
      })
      break;
    case "Admin":
      await Admin.create({
        firstName: fields.firstName,
        lastName: fields.lastName,
        userId: createUser.userId
      })
      break;
    default: 
      throw new Error('invalid userType');
  }
}

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
  registerUser,
  validateUser,
  getResumeStream
};
