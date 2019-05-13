'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'JobSeekers',
      'UserUserId',
      Sequelize.STRING
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'JobSeekers',
      'UserUserId'
    );
  }
};
