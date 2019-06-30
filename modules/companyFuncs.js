const { Company, Job } = require('../models');
const { statesToRegion } = require('../constants');

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

const updatePOC = async (userId, fields) => {
    const poc = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        phoneNumber: fields.phoneNumber,
        email: fields.email
    }
    const company = await Company.update(
        { poc },
        { where: { userId } }
    );
    if (!company) {
        throw new Error('Company does not exist');
    }
};

const addJob = async (userId, fields) => {
    try {
        const company = await getProfile(userId)
        if (company.companyStatus !== 'Active'){
            throw new Error('!Active')
        }
        if (!fields.skills) {
            fields.skills = []
        }
        await Job.create({
            companyId: userId,
            description: fields.description,
            title: fields.title,
            city: fields.city,
            state: fields.state,
            skills: fields.skills,
            active: true,
            region: statesToRegion[fields.state],
            type: fields.type,
            qualifications: fields.qualifications,
        });
    } catch (err) {
        console.log(err)
        if (err.message === '!Active') {
            throw new Error('Company is not Active'); 
        }
        throw new Error('Create Job Failed');
    }
};

const getJobs = async (companyId, offset = 0) => {
    const jobs = await Job.findAll({
        where: { companyId },
        order: [['updatedAt', 'DESC']],
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
    updatePOC,
    addJob,
    getJobs
};
  