require('dotenv').config();
const express = require('express');
const { User, Company, Job, JobSeeker, JobsSaved, Admin } = require('../models');
const jobFuncs = require('../modules/jobFuncs');

const router = express.Router();

/* GET home page. */
router.get('/test', async (req, res, next) => {
  try {
    const stuff = await User.create({ email: 'test@test.com', password: 'test', userType: 'Company' });
    const moreStuff = await Company.create({ userId: stuff.userId, name: 'test', lastName: 'anotherTest', poc: {}, companyStatus: 'Active' });

    const again = await User.create({ email: 'test2@test2.com', password: 'test', userType: 'JobSeeker' });
    const againAgain = await JobSeeker.create({ userId: again.userId, firstName: 'test', lastName: 'test' });

    const newJob = await Job.create({
      companyId: stuff.userId, description: 'test', skills: ['test'], title: 'test Title',
      city: 'Testington', state: 'AL', active: true, region: 'Southeast', type: 'Full Time'
    });

    const newJob2 = await Job.create({
      companyId: stuff.userId, description: 'counting churros', skills: ['basic math'], title: 'Churro Counter',
      city: 'McLean', state: 'VA', active: true, region: 'Northeast', type: 'Full Time'
    });

    const newJob3 = await Job.create({
      companyId: stuff.userId, description: 'counting churros', skills: ['basic math'], title: 'Churro Counter',
      city: 'Houston', state: 'TX', active: true, region: 'Southwest', type: 'Part Time'
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

router.get('/createadmin', async (req, res, next) => {
  try {
    const stuff = await User.create({ email: 'admin@admin.com', password: 'test', userType: 'Admin' });
    const moreStuff = await Admin.create({ userId: stuff.userId, firstName: 'test', lastName: 'anotherTest'});

  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.get('/appli', async (req, res) => {
  try {
    const applicants = await jobFuncs.applicants('d16afb6f-1a5c-4b5f-9595-5e5dddea23b3');
    res.send({ success: true, data: applicants });
  } catch (err) {
    console.log(err);
    res.send('error');
  }
})

module.exports = router;
