'use strict';
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const { userTypes } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      field: 'id',
    },
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    userType: {
      type: DataTypes.ENUM,
      values: userTypes,
    },
  }, {});

  User.beforeCreate(async (user) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);

      user.password = hash;
      user.userId = uuid();
      user.email = user.email.toLowerCase();
    } catch (err) {
     throw new Error();
    }
  });

  User.associate = (models) => {
    User.hasOne(models.Company);
    User.hasOne(models.JobSeeker);
    User.hasOne(models.Admin);
  };

  User.prototype.validPassword = async (password) => {
    return bcrypt.compare(password, this.password);
  };

  return User;
}