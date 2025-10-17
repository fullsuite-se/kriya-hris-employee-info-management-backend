const { Error } = require("sequelize");
const { CompanyEmployer } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await CompanyEmployer.findAll({
        order: [['company_employer_name', 'ASC']]
    });
};

exports.findOne = async (company_employer_id) => {
    const company_employer = await CompanyEmployer.findByPk(company_employer_id);
    if (!company_employer) throw new Error('No company_employer found');
    return company_employer;
};


exports.create = async (company_employer_name) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await CompanyEmployer.create({
        company_employer_id: generateUUIV4(),
        company_employer_name,
        created_at,
        updated_at,
    });
};

exports.update = async (company_employer_id, company_employer_name) => {
    const company_employer = await CompanyEmployer.findByPk(company_employer_id);

    if (!company_employer) throw new Error("No company_employer found");

    company_employer.set({
        company_employer_name,
        updated_at: getIsoUTCNow(),
    });

    await company_employer.save();
    return company_employer;
};

exports.delete = async (company_employer_id) => {
    const company_employer = await CompanyEmployer.findByPk(company_employer_id);

    if (!company_employer) throw new Error('No company_employer found');

    company_employer.destroy();

    return company_employer;
};