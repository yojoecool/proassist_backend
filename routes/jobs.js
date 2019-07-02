require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const { Job, JobsApplied, JobsSaved } = require('../models');
const jobFuncs = require('../modules/jobFuncs');
const { verifyUser } = require('../middleware');

const Op = Sequelize.Op;
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : null;
    const jobs = await jobFuncs.filterJobs(filters, req.query.userId);
    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/apply', verifyUser, async (req, res) => {
  console.log('applying for job', req.body);
  try {
    const appliedJob = await jobFuncs.apply(req.body.jobSeekerId, req.body.jobId);
    res.json({ success: true, appliedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/save', verifyUser, async (req, res) => {
  console.log('saving job', req.query.jobId);
  try {
    const savedJob = await jobFuncs.save(req.body.jobSeekerId, req.body.jobId);
    res.json({ success: true, savedJob });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

router.post('/unsave', verifyUser, async (req, res) => {
  try {
    await jobFuncs.unsave(req.body.jobId);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

module.exports = router;
