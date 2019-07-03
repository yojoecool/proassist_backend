require('dotenv').config();
const Sequelize = require('sequelize');
const { Job, JobSeeker } = require('../models');

const filterJobs = async (filters) => {
  const where = createFilterStatement(filters);
  console.log(where)

  const all = await filterAllJobs(where);

  return { all };
};

const createFilterStatement = (filters) => {
  const whereStatement = {};
  if (filters.title) {
    whereStatement.title = Sequelize.where(Sequelize.fn('UPPER', Sequelize.col('title')), 'LIKE', '%' + filters.title.toUpperCase() + '%');
  }
  if (filters.city) {
    whereStatement.city = Sequelize.where(Sequelize.fn('UPPER', Sequelize.col('city')), 'LIKE', '%' + filters.city.toUpperCase() + '%');
  }
  if (filters.state) {
    whereStatement.state = filters.state;
  }
  if (filters.region) {
    whereStatement.region = filters.region;
  }
  if (filters.type) {
    whereStatement.type = filters.type;
  }

  return whereStatement;
}

const filterAllJobs = async (where) => {
  const jobs = await Job.findAll({ where });
  return jobs;
};

const filterSavedJobs = async (jobSeeker, where = {}) => {
  const jobsSaved = await jobSeeker.getJobSaved({ where });
  return jobsSaved;
};

const filterAppliedJobs = async (jobSeeker, where = {}) => {
  const jobsApplied = await jobSeeker.getJobApplied({ where });
  return jobsApplied;
};

const userJobs = async (userId) => {
  const jobSeeker = await JobSeeker.findOne({ where: { userId } });
  const savedJobs = await filterSavedJobs(jobSeeker);
  const appliedJobs = await filterAppliedJobs(jobSeeker);

  const saved = savedJobs.map(job => job.dataValues.jobId);
  const applied = appliedJobs.map(job => job.dataValues.jobId);

  return { saved, applied };
}

module.exports = {
  filterJobs,
  userJobs
};