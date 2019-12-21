require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const serverless = require('serverless-http');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const companiesRouter = require('./routes/companies');
const jobsRouter = require('./routes/jobs');

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/companies', companiesRouter);
app.use('/api/v1/careers', jobsRouter);

module.exports = app;
module.exports.handler = serverless(app, {
    binary: [
        'application/pdf', 'application/json', 'image/*', 'application/octet-stream'
    ]
});
