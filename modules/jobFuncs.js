require('dotenv').config();
const Sequelize = require('sequelize');
const { Job, JobsApplied, JobsSaved, JobSeeker } = require('../models');

const filterJobs = async (filters, userId) => {
  const allJobs = await filterAllJobs(filters);
  const allJobIds = allJobs.map(job => job.dataValues.jobId);
  let savedJobs = [];
  let appliedJobs = [];
  let jobsSavedApplied = [];
  let savedJobIds = [];
  let appliedJobIds = [];
  let jobsSavedAppliedIds = [];
  if (userId) {
    const jobSeeker = await JobSeeker.findOne({ where: { userId } });
    savedJobs = await filterSavedJobs(jobSeeker);
    savedJobIds = savedJobs.map(job => job.dataValues.jobId);
    appliedJobs = await filterAppliedJobs(jobSeeker);
    appliedJobIds = appliedJobs.map(job => job.dataValues.jobId);
    jobsSavedApplied = savedJobs.filter(job => appliedJobIds.includes(job.dataValues.jobId));
    jobsSavedAppliedIds = jobsSavedApplied.map(job => job.dataValues.jobId);
  }
  let jobs = {};
  if (!filters.saved && !filters.applied) {
    console.log('no saved and applied filters');
    const savedFiltered = allJobIds.filter(jobId => savedJobIds.includes(jobId));
    const appliedFiltered = allJobIds.filter(jobId => appliedJobIds.includes(jobId));
    jobs = {
      all: allJobs,
      saved: savedFiltered,
      applied: appliedFiltered
    };
  } else if (filters.saved && filters.applied) {
    console.log('both saved applied filters on');
    const jobsFiltered = allJobs.filter(job => jobsSavedAppliedIds.includes(job.dataValues.jobId));
    const jobsFilteredIds = jobsFiltered.map(job => job.dataValues.jobId);
    jobs = {
      all: jobsFiltered,
      saved: jobsFilteredIds,
      applied: jobsFilteredIds
    };
  } else if (filters.saved) {
    console.log('only saved filter on');
    const jobsFiltered = allJobs.filter(job => savedJobIds.includes(job.dataValues.jobId));
    const jobsFilteredIds = jobsFiltered.map(job => job.dataValues.jobId);
    const jobsFilteredAppliedIds = jobsFilteredIds.filter(jobId => jobsSavedAppliedIds.includes(jobId));
    jobs = {
      all: jobsFiltered,
      saved: jobsFilteredIds,
      applied: jobsFilteredAppliedIds
    };
  } else if (filters.applied) {
    console.log('only applied filter on');
    const jobsFiltered = allJobs.filter(job => appliedJobIds.includes(job.dataValues.jobId));
    const jobsFilteredIds = jobsFiltered.map(job => job.dataValues.jobId);
    const jobsFilteredSavedIds = jobsFilteredIds.filter(jobId => jobsSavedAppliedIds.includes(jobId));
    jobs = {
      all: jobsFiltered,
      saved: jobsFilteredSavedIds,
      applied: jobsFilteredIds
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
    where: whereStatement,
    order: [['updatedAt', 'DESC']]
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

const apply = async (jobSeekerId, jobId) => {
  const appliedJob = await JobsApplied.create({
    jobSeekerId,
    jobId,
    status: 'Applied'
  });
  return appliedJob;
};

const save = async (jobSeekerId, jobId) => {
  const savedJob = await JobsSaved.create({ 
    jobSeekerId, 
    jobId
  });
  return savedJob;
};

const unsave = async (jobId) => {
  await JobsSaved.destroy({
    where: {
      jobId
    }
  });
};

module.exports = {
  filterJobs,
  apply,
  save,
  unsave
};