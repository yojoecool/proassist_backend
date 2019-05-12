'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobsSaved = sequelize.define('JobsSaved', {
    userId: DataTypes.UUID,
    jobId: DataTypes.UUID
  }, {
    freezeTableName: true,
    tableName: 'JobsSaved',
  });
  JobsSaved.associate = function(models) {
    // associations can be defined here
  };
  return JobsSaved;
};