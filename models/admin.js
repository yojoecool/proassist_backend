'use strict';
const { Model } = require('sequelize');

class Admin extends Model {}

Admin.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.UUID,
  },
}, {});

Admin.associate = (models) => {
  Admin.belongsTo(models.User, { foreignKey: 'userId' });
};
