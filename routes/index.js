require('dotenv').config();
const express = require('express');

const router = express.Router();

router.get('/', async (_, res) => {
    res.send('success');
});


module.exports = router;
