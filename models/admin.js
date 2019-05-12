'use strict';
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {});

  Admin.associate = (models) => {
    Admin.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Admin;
};
