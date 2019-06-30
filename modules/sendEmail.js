require('dotenv').config();
const AWS = require('aws-sdk');

const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-east-1'
});

const sendEmail = async (
  message,
  subject,
  ToAddresses,
  format = "text",
  // BccAddresses = [],
  // CcAddresses = [],
  // ReplyToAddresses = []
  ) => {
    const Body = {};

  if (!Array.isArray(ToAddresses)) {
    ToAddresses = [ToAddresses];
  }

  if (format === "html") {
    Body.Html = {
      Charset: "UTF-8",
      Data: message
    }
  } else {
    Body.Text = {
      Charset: "UTF-8",
      Data: message
    }
  }

  const params = {
    Destination: {
      ToAddresses
    },
    Message: {
      Body,
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    },
    Source: process.env.AWS_ADMIN_EMAIL
  };

  await ses.sendEmail(params).promise();
}

module.exports = sendEmail;
