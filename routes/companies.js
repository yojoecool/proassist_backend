require('dotenv').config();
const express = require('express');
const { verifyUser } = require('../middleware');
const companyFuncs = require('../modules/companyFuncs');

const router = express.Router();

router.get('/getProfile', verifyUser, async (req, res) => {
  // verify userId
    if (req.locals.userId !== req.query.user) {
      res.status(403);
      res.json({ success: false });
      return;
    }
  
    try {
      console.log('fetching company details')
      const companyObject = await companyFuncs.getProfile(req.query.user)
      res.json({ success: true, companyObject });

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

module.exports = router;
