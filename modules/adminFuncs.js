const { Company, Job, JobsApplied } = require('../models');

const getPendingCompanies = async (offset = 0, limit = 10) => {
    const companies = await Company.findAll({
        where: { companyStatus : 'Pending' },
        order: [['updatedAt', 'DESC']],
        limit,
        offset
    });
    return companies;
};

const updateCompanyStatus = async (userId, companyStatus) => {
    if (companyStatus === 'Active' || companyStatus === 'Rejected') {
        await Company.update(
            { companyStatus },
            { where: { userId }} 
        );
    } else {
        throw new Error('Not a valid status');
    }
};

// NOT DONE
const getAppliedJobs = async (offset = 0, limit = 10) => {
    const jobs = await Job.findAll({
        // where: { companyStatus : 'Pending' },
        order: [['updatedAt', 'DESC']],
        limit,
        offset
    });
    return jobs;
};

module.exports = {
    getPendingCompanies,
    updateCompanyStatus,
    getAppliedJobs
};
  