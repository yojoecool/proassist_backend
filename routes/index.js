var express = require('express');
var router = express.Router();

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

module.exports = router;
