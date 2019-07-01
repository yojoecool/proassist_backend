require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const { Job, JobsApplied, JobsSaved } = require('../models');
const jobFuncs = require('../modules/jobFuncs');

const Op = Sequelize.Op;
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('backend search');
    const filters = req.query.filters ? JSON.parse(req.query.filters) : null;
    const jobs = await jobFuncs.filterJobs(filters, req.query.userId);
    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/apply', async (req, res) => {
  console.log('applying for job', req.body);
  try {
    const appliedJob = await JobsApplied.create({
      jobSeekerId: req.body.jobSeekerId,
      jobId: req.body.jobId,
      status: 'Applied'
    });
    // console.log('appliedJob:', appliedJob);
    res.json({ success: true, appliedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/save', async (req, res) => {
  console.log('saving job', req.query.jobId);
  try {
    const savedJob = await JobsSaved.create({ jobSeekerId: req.body.jobSeekerId, jobId: req.body.jobId });
    // console.log('savedJob:', savedJob);
    res.json({ success: true, savedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/unsave', async (req, res) => {
  try {
    await JobsSaved.destroy({
      where: {
        jobId: req.body.jobId
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

module.exports = router;
