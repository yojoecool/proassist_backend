'use strict';
const uuid = require('uuid/v4');

const { regions, states, jobTypes } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobId: {
      type: DataTypes.UUID,
      field: 'id',
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

  Job.beforeCreate(job => job.id = uuid());

  Job.associate = (models) => {
    Job.belongsTo(models.Company, { foreignKey: 'companyId', targetKey: 'userId' });
    Job.belongsToMany(models.JobSeeker, { through: 'JobsSaved', foreignKey: 'jobId', targetKey: 'id' });
  };

  return Job;
};