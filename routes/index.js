var express = require('express');
var router = express.Router();

const { User, Admin } = require('../models');

/* GET home page. */
router.get('/test', async (req, res, next) => {
  try {
    const stuff = await User.create({ email: 'test@test.com', password: 'test', userType: 'Admin' });
    const moreStuff = await Admin.create({ userId: stuff.userId, firstName: 'test', lastName: 'anotherTest' });
    res.send({ ...stuff.dataValues, ...moreStuff.dataValues });
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

module.exports = router;
