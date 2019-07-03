require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
<<<<<<< HEAD
const companiesRouter = require('./routes/companies');
=======
const jobsRouter = require('./routes/jobs');
>>>>>>> 8be878ff2e6a195c7040892892c69a968f0803b5

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
<<<<<<< HEAD
app.use('/companies', companiesRouter);
=======
app.use('/careers', jobsRouter);
>>>>>>> 8be878ff2e6a195c7040892892c69a968f0803b5

module.exports = app;
