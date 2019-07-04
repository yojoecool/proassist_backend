require('dotenv').config();
const express = require('express');
const { verifyUser, verifyAdmin } = require('../middleware');
const companyFuncs = require('../modules/companyFuncs');
const adminFuncs = require('../modules/adminFuncs');

const router = express.Router();

router.get('/getPendingCompanies', verifyUser, verifyAdmin, async (req, res) => {
    try {
      const pendingCompanies = await 
        adminFuncs.getPendingCompanies(
          req.query.offset, req.query.limit
        );
      res.json({ success: true, pendingCompanies });
    } catch (err) {
      res.status(500);
      res.json({ success: false });
    }
});

router.put('/updateCompanyStatus', verifyUser, verifyAdmin, async (req, res) => {
    try {
      await adminFuncs.updateCompanyStatus(
          req.body.companyId, req.body.status
        );
      res.json({ success: true });
    } catch (err) {
        if (err.message === 'Not a valid status'){
            res.status(403);
        } else {
            res.status(500);
        }
        res.json({ success: false });
    }
});

router.get('/getAppliedJobs', verifyUser, verifyAdmin, async (req, res) => {
    try {
      const appliedJobs = await 
        adminFuncs.getAppliedJobs(
          req.query.offset, req.query.limit
        );
      res.json({ success: true, appliedJobs });
    } catch (err) {
      res.status(500);
      res.json({ success: false });
    }
});



module.exports = router;