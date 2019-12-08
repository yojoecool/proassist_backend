'use strict';
module.exports = (sequelize, DataTypes) => {
  const DoNotSend = sequelize.define('DoNotSend', {
    email: DataTypes.STRING
  }, {});
  DoNotSend.associate = function(models) {
    // associations can be defined here
  };
  return DoNotSend;
};