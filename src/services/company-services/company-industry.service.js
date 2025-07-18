const { CompanyIndustry } = require("../../models");
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await CompanyIndustry.findAll();
};

exports.create = async (industry_type) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await CompanyIndustry.create({
        industry_id: generateUUIV4(),
        industry_type,
        created_at,
        updated_at,
    });
};

exports.update = async (industry_id, industry_type) => {
    const industry = await CompanyIndustry.findByPk(industry_id);

    if (!industry) throw new Error('Industry not found');

    industry.set({
        industry_type,
        updated_at: getIsoUTCNow(),
    });

    await industry.save();
    return industry;
};

exports.delete = async (industry_id) => {
    const industry = await CompanyIndustry.findByPk(industry_id);

    if (!industry) throw new Error('Industry not found');


    await industry.destroy();
    return industry;
};