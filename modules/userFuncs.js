require('dotenv').config();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, JobSeeker, Company, Admin } = require('../models');

const createJwt = (user) => {
  const { APP_SECRET } = process.env;
  const tokenData = {
    userId: user.userId,
    email: user.email,
    userType: user.userType
  };

  switch (user.userType) {
    case 'Company':
      tokenData.name = user.name;
      tokenData.companyStatus = user.companyStatus;
      break;
    case 'Admin':
    case 'JobSeeker':
      tokenData.name = `${user.firstName} ${user.lastName}`;
      break;
    default:
      tokenData.name = '';
      break;
  }

  const token = jwt.sign(tokenData, APP_SECRET, { expiresIn: '24h' });

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
        `\n\nNavigate to ProAssist to approve or deny the request!`,
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
  const { user, userData } = await getUserInfo(null, email);
  console.log(userData)
  if (!user) {
    throw new Error('invalid');
  }
  const validUser = await user.validPassword(password);
  if (!validUser) {
    throw new Error('invalid');
  }

  return createJwt(userData);
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

const getUserInfo = async (userId = null, email = null) => {
  const where = {
    ...(userId && { userId }),
    ...(email && { email })
  }

  const user = await User.findOne({ where });
  if (!user) {
    throw new Error('User not found');
  }

  const { userType, email: confirmedEmail, userId: confirmedId } = user.dataValues;
  let userData = { userType, email: confirmedEmail, userId: confirmedId };
  let firstName;
  let lastName;

  switch(userType) {
    case 'Admin':
      const admin = await Admin.findOne({ where: { userId: confirmedId } });
      ({ firstName, lastName } = admin.dataValues);
      userData = { ...userData, firstName, lastName };
      break;
    case 'JobSeeker':
      const jobSeeker = await JobSeeker.findOne({ where: { userId: confirmedId } });
      ({ firstName, lastName } = jobSeeker.dataValues);
      userData = { ...userData, firstName, lastName };
      break;
    case 'Company':
      const company = await Company.findOne({ where: { userId: confirmedId } });
      const { name, poc, companyStatus } = company.dataValues;
      userData = { ...userData, name, poc, companyStatus };
      break;
    default:
      break;
  }

  return { user, userData };
}

const sendEmail = async (emails, messageText, subject) => {
  if (typeof emails === "string") {
    emails = [emails];
  } else if (!Array.isArray(emails)) {
    throw new Error("invalid array");
  }

  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
  });

  const messageBody =
    `<div style="white-space: pre-wrap;word-break: keep-all">${messageText}</div>`;

  const params = {
    Destination: {
      ToAddresses: emails
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: messageBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    ReturnPath: 'admin@proassist.careers',
    Source: 'admin@proassist.careers'
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (err) {
    console.log(err);
    throw new Error("Unable to send email");
  }
}

module.exports = {
  createJwt,
  registerUser,
  validateUser,
  getResumeStream,
  notifyAdmins,
  getUserInfo,
  updatePassword,
  getResumeStream,
  sendEmail
};
