'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('JobsSaved', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('JobsSaved');
  }
};