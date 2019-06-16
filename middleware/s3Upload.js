require('dotenv').config();
const AWS = require('aws-sdk');
const path = require('path');
const multer  = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-east-1'
});

const storage =  multerS3({
  s3,
  bucket: process.env.BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, req.locals.userId + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });
