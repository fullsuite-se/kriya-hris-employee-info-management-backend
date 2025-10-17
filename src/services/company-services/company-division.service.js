const { Error } = require("sequelize");
const { CompanyDivision } = require("../../models");
const { getIsoUTCNow, getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async (company_id) => {
    return await CompanyDivision.findAll({
        where: { company_id },
        order: [['division_name', 'ASC']]
    });
};

exports.findOne = async (division_id) => {
    const division = await CompanyDivision.findByPk(division_id);

    if (!division) throw new Error('No division found');

    return division;
};

exports.create = async (company_id, division_name) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await CompanyDivision.create({
        division_id: generateUUIV4(),
        company_id,
        division_name,
        created_at,
        updated_at,
    });
};

exports.update = async (division_id, division_name) => {
    const division = await CompanyDivision.findByPk(division_id);

    if (!division) throw new Error("No division found");

    division.set({
        division_name,
        updated_at: getIsoUTCNow(),
    });

    await division.save();
    return division;
};

exports.delete = async (division_id) => {
    const division = await CompanyDivision.findByPk(division_id);

    if (!division) throw new Error('No division found');

    await division.destroy();
    return division;
};