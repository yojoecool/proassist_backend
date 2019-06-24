const { Company, Job } = require('../models');

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

const addJob = async (fields) => {
    try {
        await Job.create({
            companyId: fields.user,
            description: fields.description,
            skills: fields.skills,
            title: fields.title,
            city: fields.city,
            state: fields.state,
            active: true,
            region: fields.region,
            type: fields.type,
            qualifications: fields.qualifications,
        });
    } catch (err) {
        throw new Error('Create Job Failed');
    }
};

const getJobs = async (companyId, offset = 0) => {
    const jobs = await Job.findAll({
        where: { companyId },
        order: [['title', 'DESC']],
        limit: 10,
        offset
    });

    if (!jobs) {
        throw new Error('userId does not exist');
    }
    
    return jobs
};



module.exports = {
    getProfile,
    addJob,
    getJobs
};
  