var express = require('express');
var router = express.Router();

const { User } = require('../models');

/* GET home page. */
router.get('/test', async (req, res, next) => {
  const stuff = await User.create({ email: 'test@test.com', password: 'test', userType: 'admin' });
  res.send(stuff);
});

module.exports = router;
