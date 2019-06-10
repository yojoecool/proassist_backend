require('dotenv').config();
const express = require('express');
const fs = require('fs');
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
  bucket: 'proassist-test',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, file.originalname) // + path.extname(file.originalname))
  }
});

const upload = multer({ storage });
const router = express.Router();

const { User, Company, Job, JobSeeker } = require('../models');

/* GET home page. */
router.get('/test', async (req, res, next) => {
  try {
    const stuff = await User.create({ email: 'test@test.com', password: 'test', userType: 'Company' });
    const moreStuff = await Company.create({ userId: stuff.userId, name: 'test', lastName: 'anotherTest', poc: {} });

    const again = await User.create({ email: 'test2@test2.com', password: 'test', userType: 'JobSeeker' });
    const againAgain = await JobSeeker.create({ userId: again.userId, firstName: 'test', lastName: 'test', userType: 'Company' });

    const newJob = await Job.create({
      companyId: stuff.userId, description: 'test', skills: ['test'], title: 'test Title',
      city: 'Testington', state: 'AL', active: true, region: 'Southeast', type: 'FullTime'
    });
    
    await againAgain.addJobSaved(newJob);
    await againAgain.addJobApplied(newJob, { through: { status: 'Applied' }});

    console.log(await againAgain.getJobSaved());
    console.log(await againAgain.getJobApplied());
    console.log(await newJob.getSavedBy());
    console.log(await newJob.getAppliedBy());

    res.send({ ...stuff.dataValues, ...moreStuff.dataValues });
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.get('/test2', async (req, res) => {
  res.send(await newJob.getUsersApplied());
});

router.get('/somefile', (req, res) => {
  const params = { Bucket: 'proassist-test', Key: 'file.pdf' };

  try {
    res.attachment('file.pdf');
    const fileStream = s3.getObject(params).createReadStream();
    fileStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/s3pdf', upload.single('file'), async (req, res) => {
  res.send('success');
});

module.exports = router;
