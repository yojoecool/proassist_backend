require('dotenv').config();
const express = require('express');
const Sequelize = require('sequelize');
const { Job } = require('../models');

const Op = Sequelize.Op;
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('backend search');
    // const jobs = await Job.findAll();
    const filters = req.query.filters ? JSON.parse(req.query.filters) : null;
    const whereStatement = {};
    if (filters.title) {
      whereStatement.title = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + filters.title + '%');
    }
    if (filters.city) {
      whereStatement.city = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city')), 'LIKE', '%' + filters.city + '%');
    }
    if (filters.state) {
      whereStatement.state = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('state')), 'LIKE', filters.state);
    }
    if (filters.region) {
      whereStatement.region = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('region')), 'LIKE', filters.region);
    }
    if (filters.type) {
      whereStatement.type = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('type')), 'LIKE', filters.type);
    }
    const jobs = await Job.findAll({
      where: whereStatement
      // where: {
      //   title: filters.title ? { [Op.like]: '%' + filters.title + '%' } : { [Op.ne]: null },
      //   city: filters.city ? { [Op.like]: '%' + filters.city + '%' } : { [Op.ne]: null },
      //   state: filters.state ? filters.state : { [Op.ne]: null },
      //   region: filters.region ? filters.region : { [Op.ne]: null },
      //   type: filters.type ? filters.type : { [Op.ne]: null }
      // }
    });
    console.log('jobs from db:', jobs);
    res.json(jobs)
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ success: false });
  }
});

module.exports = router;
