'use strict';
const { companyStatus } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Companies',
      'companyStatus',
      {
        type: Sequelize.ENUM,
        values: companyStatus,
        allowNull: false
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Companies',
      'companyStatus'
    ).then(() => {
      queryInterface.sequelize.query('drop type "enum_Companies_companyStatus"');
    });
  }
};
