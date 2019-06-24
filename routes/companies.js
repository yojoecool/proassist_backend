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

router.post('/addJob', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.user) {
    res.status(403);
    res.json({ success: false });
    return;
  }

  try {
    await companyFuncs.addJob(req.body)
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
    }
});

router.get('/getJobs', verifyUser, async (req, res) => {
    if (req.locals.userId !== req.query.user) {
      res.status(403);
      res.json({ success: false });
      return;
    }
  
    try {
      const jobs = await companyFuncs.getJobs(req.query.user, req.query.offset)
      res.json({ success: true, jobs });
    } catch (err) {
      console.log(err);
   
      if (err.message === 'userId does not exist'){
        res.status(404);
        res.json({ success: false });
        return;
      }

      res.status(500);
      res.json({ success: false });
    }
});

// TODO Add Jobs, Remove (disable Job), edit profile, deactivate account
module.exports = router;
