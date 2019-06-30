require('dotenv').config();
const { Job, JobsApplied, JobsSaved, JobSeeker } = require('../models');

const filterJobs = async (filters, userId) => {
  const allJobs = await filterAllJobs(filters);
  let savedJobs = [];
  let appliedJobs = [];
  let jobsSavedApplied = [];
  if (userId) {
    const jobSeeker = await JobSeeker.findOne({ where: { userId } });
    savedJobs = await filterSavedJobs(jobSeeker);
    appliedJobs = await filterAppliedJobs(jobSeeker);
    jobsSavedApplied = savedJobs.filter(job => appliedJobs.includes(job));
  }
  let jobs = {};
  if (!filters.saved && !filters.applied) {
    jobs = {
      all: allJobs,
      saved: savedJobs,
      applied: appliedJobs
    };
  } else if (filters.saved && filters.applied) {
    const jobsFiltered = allJobs.filter(job => jobsSavedApplied.includes(job));
    jobs = {
      all: jobsFiltered,
      saved: jobsFiltered,
      applied: jobsFiltered
    };
  } else if (filters.saved) {
    const jobsFiltered = allJobs.filter(job => savedJobs.includes(job));
    const jobsFilteredApplied = jobsFiltered.filter(job => jobsSavedApplied.includes(job));
    jobs = {
      all: jobsFiltered,
      saved: jobsFiltered,
      applied: jobsFilteredApplied
    };
  } else if (filters.applied) {
    const jobsFiltered = allJobs.filter(job => appliedJobs.includes(job));
    const jobsFilteredSaved = jobsFiltered.filter(job => jobsSavedApplied.includes(job));
    jobs = {
      all: jobsFiltered,
      saved: jobsFilteredSaved,
      applied: jobsFiltered
    };
  }
  return jobs;
};

const filterAllJobs = async (filters) => {
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
  const jobs = await Job.findAll({
    where: whereStatement
  });
  return jobs;
};

const filterSavedJobs = async (jobSeeker) => {
  const jobsSaved = await jobSeeker.getJobSaved();
  return jobsSaved;
};

const filterAppliedJobs = async (jobSeeker) => {
  const jobsApplied = await jobSeeker.getJobApplied();
  return jobsApplied;
};

module.exports = {
  filterJobs
};