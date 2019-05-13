'use strict';
const uuid = require('uuid/v4');

const { regions, states, jobTypes } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    companyId: DataTypes.UUID,
    description: DataTypes.STRING,
    skills: DataTypes.ARRAY(DataTypes.STRING),
    title: DataTypes.STRING,
    city: DataTypes.STRING,
    state: {
      type: DataTypes.ENUM,
      values: states,
    },
    active: DataTypes.BOOLEAN,
    region: {
      type: DataTypes.ENUM,
      values: regions,
    },
    type: {
      type: DataTypes.ENUM,
      values: jobTypes,
    },
    qualifications: DataTypes.STRING,
  }, {});

  Job.beforeCreate(job => job.jobId = uuid());

  Job.associate = (models) => {
    Job.belongsTo(models.Company, { foreignKey: 'companyId' });
    Job.belongsToMany(models.JobSeeker, {
      through: 'JobsSaved',
      foreignKey: 'jobId',
      as: 'SavedBy',
    });
    Job.belongsToMany(models.JobSeeker, {
      through: 'JobsApplied',
      foreignKey: 'jobId',
      as: 'AppliedBy',
    });
  };

  return Job;
};