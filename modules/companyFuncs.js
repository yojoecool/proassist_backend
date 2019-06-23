const { Company } = require('../models');

const getProfile = async (userId) => {
    const company = await Company.findOne({ where: { userId }});
    if (!company) {
        throw new Error('userId does not exist');
    }
    const companyObject = {
        companyName: company.name,
        email: company.email,
        poc: company.poc,
        companyStatus: company.companyStatus
    }
    return companyObject
};

module.exports = {
    getProfile,
};
  