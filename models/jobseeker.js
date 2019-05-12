'use strict';
const { Model } = require('sequelize');

class JobSeeker extends Model {}

JobSeeker.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  userId: DataTypes.UUID,
}, {});

JobSeeker.associate = (models) => {
  JobSeeker.belongsTo(models.User, { foreignKey: 'userId' });
};
