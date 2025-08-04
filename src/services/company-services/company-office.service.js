const { Error } = require("sequelize");
const { CompanyOffice } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async (company_id) => {
    return await CompanyOffice.findAll({
        where: { company_id }
    });
};

exports.findOne = async (office_id) => {
    const office = await CompanyOffice.findByPk(office_id);
    if (!office) throw new Error('No office found');
    return office;
};


exports.create = async (company_id, office_name, office_address) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await CompanyOffice.create({
        office_id: generateUUIV4(),
        company_id,
        office_name,
        office_address,
        created_at,
        updated_at,
    });
};

exports.update = async (office_id, office_name, office_address) => {
    const office = await CompanyOffice.findByPk(office_id);

    if (!office) throw new Error("No team found");

    office.set({
        office_name,
        office_address,
        updated_at: getIsoUTCNow(),
    });

    await office.save();
    return office;
};

exports.delete = async (office_id) => {
    const office = await CompanyOffice.findByPk(office_id);

    if (!office) throw new Error('No office found');

    office.destroy();
    
    return office;
};