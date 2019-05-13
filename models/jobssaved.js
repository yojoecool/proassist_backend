'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobsSaved = sequelize.define('JobsSaved', {
    jobId: DataTypes.UUID,
    jobSeekerId: DataTypes.UUID,
  }, {
    freezeTableName: true,
    tableName: 'JobsSaved',
  });

  return JobsSaved;
};