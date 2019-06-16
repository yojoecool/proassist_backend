const express = require('express');
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

router.post('/register', async (req, res) => {
  try {
    //push information to backend
    //call function to add new user
    console.log(req.body);
    //const newUser = await User.create({ email: 'test@test.com', password: 'test', userType: 'Company' });
    res.json({ success: true });
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

module.exports = router;
