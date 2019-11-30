require('dotenv').config();
const express = require('express');
const { verifyUser } = require('../middleware');
const companyFuncs = require('../modules/companyFuncs');

const router = express.Router();

router.get('/getProfile', verifyUser, async (req, res) => {
  // verify userId
    if (req.locals.userId !== req.query.userId) {
      res.status(403);
      res.json({ success: false });
      return;
    }
  
    try {
      const companyObject = await companyFuncs.getProfile(req.query.userId)
      res.json({ success: true, companyObject });
    } catch (err) {
      if (err.message === 'userId does not exist'){
        res.status(404);
        res.json({ success: false });
        return;
      }

      res.status(500);
      res.json({ success: false });
    }
});

router.put('/updatePOC', verifyUser, async (req, res) => {
    if (req.locals.userId !== req.query.userId) {
      res.status(403);
      res.json({ success: false });
      return;
    }
  
    try {

      await companyFuncs.updatePOC(req.query.userId, req.body)
      res.json({ success: true });

    } catch (err) {

      if (err.message === 'Company does not exist'){
        res.status(404);
      } else {
        res.status(500);
      }
      res.json({ success: false });
    }
});

router.post('/addJob', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.userId) {
    res.status(403);
    res.json({ success: false });
    return;
  }

  try {
    await companyFuncs.addJob(req.query.userId, req.body);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.message === 'Company is not Active') {
      res.status(403);
    } else {
      res.status(500);
    }
    res.json({ success: false });
  }
});

router.get('/getJob', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.userId) {
    res.status(403);
    res.json({ success: false });
    return;
  }
  console.log(req.query)

  try {
    const job = await companyFuncs.getJob(req.query.userId, req.query.jobId)
    res.json({ success: true, job });
  } catch (err) {   
    if (err.message === 'Job does not exist'){
      res.status(404);
      res.json({ success: false });
      return;
    }
    res.status(500);
    res.json({ success: false });
  }
});

router.put('/editJob', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.userId) {
    res.status(403);
    res.json({ success: false });
    return;
  }

  try {
    await companyFuncs.editJob(req.query.userId, req.query.jobId, req.body)
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.message === 'Company is not Active') {
      res.status(403);
    } else {
      res.status(500);
    }
    res.json({ success: false });
  }
});

router.get('/getJobs', verifyUser, async (req, res) => {
    if (req.locals.userId !== req.query.userId) {
      res.status(403);
      res.json({ success: false });
      return;
    }
    console.log('**1**', req.query)
  
    try {
      const jobs = await companyFuncs.getJobs(req.query.userId, req.query.offset, req.query.limit)
      res.json({ success: true, jobs });
    } catch (err) {   
      if (err.message === 'userId does not exist'){
        res.status(404);
        res.json({ success: false });
        return;
      }
      res.status(500);
      res.json({ success: false });
    }
});

module.exports = router;