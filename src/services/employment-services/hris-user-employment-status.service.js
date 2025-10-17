const { HrisUserEmploymentStatus } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserEmploymentStatus.findAll({
        order: [['employment_status', 'ASC']]
    });
}

exports.create = async (employment_status) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await HrisUserEmploymentStatus.create({
        employment_status_id: generateUUIV4(),
        employment_status,
        created_at,
        updated_at,
    });
}


exports.update = async (employment_status_id, employment_status) => {
    const status = await HrisUserEmploymentStatus.findByPk(employment_status_id);

    if (!status) throw new Error('employment_status not found');

    status.set({
        employment_status,
        updated_at: getIsoUTCNow(),
    });

    await status.save();
    return status;
};



exports.delete = async (employment_status_id) => {
    const status = await HrisUserEmploymentStatus.findByPk(employment_status_id);
    if (!status) throw new Error('employment_status not found');

    await status.destroy();
    return status;
};