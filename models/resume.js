'use strict';
module.exports = (sequelize, DataTypes) => {
  const Resume = sequelize.define('Resume', {
    userId: DataTypes.UUID,
    s3id: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {});

  Resume.associate = function(models) {
    Resume.belongsTo(models.JobSeeker, { foreignKey: 'userId', targetKey: 'userId' });
  };

  return Resume;
};
