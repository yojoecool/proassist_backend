'use strict';
const { regions, states, jobTypes } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Jobs', {
      jobId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'userId',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.ENUM(states),
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      region: {
        type: Sequelize.ENUM(regions),
      },
      type: {
        type: Sequelize.ENUM(jobTypes),
      },
      qualifications: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Jobs');
  }
};