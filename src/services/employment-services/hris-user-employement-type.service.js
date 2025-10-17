const { HrisUserEmploymentType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");
exports.findAll = async () => {
    return HrisUserEmploymentType.findAll({
        order: [['employment_type', 'ASC']]
    });
}
exports.create = async (employment_type) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();
    return await HrisUserEmploymentType.create({
        employment_type_id: generateUUIV4(),
        employment_type,
        created_at,
        updated_at
    });
}


exports.update = async (employment_status_id, employment_type) => {
    const employmentType = await HrisUserEmploymentType.findByPk(employment_status_id);

    if (!employmentType) throw new Error('employment_type not found');

    employmentType.set({
        employment_type,
        updated_at: getIsoUTCNow(),
    });

    await employmentType.save();
    return employmentType;
};



exports.delete = async (employment_status_id) => {
    const employmentType = await HrisUserEmploymentType.findByPk(employment_status_id);
    if (!employmentType) throw new Error('employment_type not found');

    await employmentType.destroy();
    return employmentType;
};