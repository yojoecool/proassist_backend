'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    poc: DataTypes.JSONB,
    userId: DataTypes.UUID,
  }, {});

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'userId' });
    Company.hasMany(models.Job, { foreignKey: 'companyId', sourceKey: 'userId' });
  };

  return Company;
};
