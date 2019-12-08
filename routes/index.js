require('dotenv').config();
const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.send('success');
});


module.exports = router;
