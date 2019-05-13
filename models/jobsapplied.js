'use strict';
const { jobStatus } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const JobsApplied = sequelize.define('JobsApplied', {
    jobId: DataTypes.UUID,
    jobSeekerId: DataTypes.UUID,
    status: {
      type: DataTypes.ENUM,
      values: jobStatus,
    },
  }, {
    freezeTableName: true,
    tableName: 'JobsApplied',
  });

  return JobsApplied;
};