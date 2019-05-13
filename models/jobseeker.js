'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobSeeker = sequelize.define('JobSeeker', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {});

  JobSeeker.associate = (models) => {
    JobSeeker.belongsTo(models.User, { foreignKey: 'userId' });
    JobSeeker.hasOne(models.Resume, { foreignKey: 'userId', sourceKey: 'userId' });
    JobSeeker.belongsToMany(models.Job, {
      through: 'JobsSaved',
      foreignKey: 'jobSeekerId',
      as: 'JobSaved',
    });
    JobSeeker.belongsToMany(models.Job, {
      through: 'JobsApplied',
      foreignKey: 'jobSeekerId',
      as: 'JobApplied',
    });
  };

  return JobSeeker;
};
