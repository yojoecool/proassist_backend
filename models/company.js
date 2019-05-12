'use strict';
const { Model } = require('sequelize');

class Company extends Model {}

Company.init({
  name: DataTypes.STRING,
  poc: DataTypes.JSONB,
  userId: DataTypes.UUID,
}, {});

Company.associate = (models) => {
  Company.belongsTo(models.User, { foreignKey: 'userId' });
};
