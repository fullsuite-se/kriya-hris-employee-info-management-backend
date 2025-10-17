const { Error } = require("sequelize");
const { CompanyJobTitle } = require("../../models");
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async (company_id) => {
    return await CompanyJobTitle.findAll({
        where: { company_id },
        order: [['job_title', 'ASC']]
    });
};

exports.findOne = async (job_title_id) => {
    const job = await CompanyJobTitle.findByPk(job_title_id);
    if (!job) throw new Error('No job found');

    return job;
};

exports.create = async (company_id, job_title) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await CompanyJobTitle.create({
        job_title_id: generateUUIV4(),
        company_id,
        job_title,
        created_at,
        updated_at
    });
};

exports.update = async (job_title_id, job_title) => {
    const job = await CompanyJobTitle.findByPk(job_title_id);

    if (!job) throw new Error('Job title not found');

    job.set({
        job_title,
        updated_at: getIsoUTCNow(),
    });

    await job.save();
    return job;
};

exports.delete = async (job_title_id) => {
    const job = await CompanyJobTitle.findByPk(job_title_id);
    if (!job) throw new Error('Job title not found');

    await job.destroy();
    return job;
};