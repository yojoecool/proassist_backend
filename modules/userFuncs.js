require('dotenv').config();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

const notifyAdmins = async (message, subject) => {
  const sns = new AWS.SNS({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
  });

  const params = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC,
    Subject: subject
  };

  await sns.publish(params).promise();
};

const registerUser = async (fields) => {
  const emailAlreadyExists = await User.findOne({ where: { email: fields.email }});
  if (emailAlreadyExists) {
    throw new Error('email already exists');
  };

  const createUser = await User.create({
    password: fields.password,
    facebookId: "",
    email: fields.email,
    userType: fields.userType
  });

  switch(fields.userType) {
    case "JobSeeker":
      await JobSeeker.create({
        firstName: fields.firstName,
        lastName: fields.lastName,
        userId: createUser.userId
      });
      break;
    case "Company":
      const poc = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.pocEmail,
        phoneNumber: fields.phoneNumber
      };
      await Company.create({
        name: fields.companyName,
        poc,
        companyStatus: 'Pending',
        userId: createUser.userId
      });
      await notifyAdmins(
        'New Company Registered!' +
        `\n\nCompany Name: ${fields.companyName}` +
        `\n\nPOC:` +
        `\n\tName: ${fields.firstName} ${fields.lastName}` +
        `\n\tEmail: ${fields.pocEmail}` +
        `\n\tPhone: ${fields.phoneNumber}` +
        `\n\nNaviage to ProAssit to approve or deny the request!`,
        'New Company Registered'
      );
      break;
    case "Admin":
      await Admin.create({
        firstName: fields.firstName,
        lastName: fields.lastName,
        userId: createUser.userId
      });
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

const updatePassword = async (userId, fields) => {
  const user = await User.findOne({ where: { userId }});
  if (!user) {
    throw new Error('User does not exist');
  }
  const validUser = await user.validPassword(fields.currentPassword);
  if (!validUser) {
    throw new Error('Current password does not match');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(fields.password, salt);

  const updatedUser = await User.update(
      { password: hash },
      { where: { userId } }
  );
  if (!updatedUser) {
      throw new Error('User does not exist');
  }
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

const getUserInfo = async (userId) => {
  const user = await User.findOne({ where: { userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const { userType, email } = user.dataValues;
  let returnValues = { userType, email };

  switch(userType) {
    case 'Admin':
    case 'JobSeeker':
      const jobSeeker = await JobSeeker.findOne({ where: { userId } });
      const { firstName, lastName } = jobSeeker.dataValues;
      returnValues = { ...returnValues, firstName, lastName };
      break;
    case 'Company':
      const company = await Company.findOne({ where: { userId } });
      const { name, poc } = company.dataValues;
      returnValues = { ...returnValues, name, poc };
      break;
    default:
      break;
  }

  return returnValues;
}

module.exports = {
  createJwt,
  registerUser,
  validateUser,
  getResumeStream,
  notifyAdmins,
  getUserInfo,
  updatePassword,
  getResumeStream
};
