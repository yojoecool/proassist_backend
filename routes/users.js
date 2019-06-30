require('dotenv').config();
const express = require('express');
const { verifyUser, s3Upload } = require('../middleware');
const userFuncs = require('../modules/userFuncs');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const token = await userFuncs.validateUser(req.body.email, req.body.password);
    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    if (err.message === 'invalid') {
      res.status(401);
      res.json({ success: false });
    } else {
      res.status(500);
      res.json({ success: false });
    }
  }
});

router.put('/updatePassword', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.userId) {
    res.status(403);
    res.json({ success: false });
    return;
  }

  try {
    await userFuncs.updatePassword(req.query.userId, req.body)
    res.json({ success: true });
  } catch (err) {
    console.log(err)
    if (err.message === 'Current password does not match') {
      res.status(403);
    } else if (err.message === 'User does not exist'){
      res.status(404);
    } else {
      res.status(500);
    }    
    res.json({ success: false });
  }
});

router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    await userFuncs.registerUser(req.body)
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.message === 'email already exists') {
      res.status(409);
      res.json({ success: false });
    } else {
      res.status(500);
      res.json({ success: false });
    }
  }
});

router.get('/getResume', verifyUser, async (req, res) => {
  if (req.locals.userId !== req.query.user && req.locals.userType !== 'Admin') {
    res.status(403);
    res.json({ success: false });
    return;
  }

  try {
    const fileStream = await userFuncs.getResumeStream(req.query.user);

    res.attachment('resume.pdf');
    fileStream.pipe(res);
  } catch (err) {
    console.log(err);

    if (err.code === 'NotFound') {
      res.status(404);
      res.json({
        error: 'File Not Found'
      });
      return;
    }

    res.status(500);
    res.json({ success: false });
  }
});

router.post('/uploadResume', verifyUser, s3Upload.single('file'), async (req, res) => {
  res.send('success');
});

module.exports = router;
