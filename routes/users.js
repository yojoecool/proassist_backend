const express = require('express');
const { User } = require('../models');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email }});
    if (!user) {
      throw new Error('invalid');
    }
    const validUser = await user.validPassword(req.body.password);
    if (!validUser) {
      throw new Error('invalid');
    }

    res.send('success');
  } catch (err) {
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
