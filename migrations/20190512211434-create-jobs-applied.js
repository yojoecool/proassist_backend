'use strict';
const { jobStatus } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('JobsApplied', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jobSeekerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'JobSeekers',
          key: 'userId',
        },
      },
      jobId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'jobId',
        },
      },
      status: {
        type: Sequelize.ENUM(jobStatus),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('JobsApplied');
  }
};