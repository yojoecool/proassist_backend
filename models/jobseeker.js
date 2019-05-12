'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobSeeker = sequelize.define('JobSeeker', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.UUID,
  }, {});

  JobSeeker.associate = (models) => {
    JobSeeker.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return JobSeeker;
};
