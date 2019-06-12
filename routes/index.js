require('dotenv').config();
const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const multer  = require('multer');
const multerS3 = require('multer-s3');
const { verifyUser } = require('../middleware');
const { User, Company, Job, JobSeeker } = require('../models');

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
    cb(null, req.locals.userId + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = express.Router();

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

router.get('/getResume', verifyUser, (req, res) => {
  if (req.locals.userId !== req.query.user && req.locals.userType !== 'Admin') {
    res.status(403);
    res.json({ success: false });
    return;
  }

  const { BUCKET_NAME } = process.env;
  const params = { Bucket: BUCKET_NAME, Key: req.query.user + '.pdf' };

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

router.post('/uploadResume', verifyUser, upload.single('file'), async (req, res) => {
  res.send('success');
});

module.exports = router;
