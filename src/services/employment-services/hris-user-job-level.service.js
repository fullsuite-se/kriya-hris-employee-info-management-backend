const { HrisUserJobLevel } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserJobLevel.findAll({
        order: [['job_level_name', 'ASC']]
    });
}

exports.create = async (job_level_name, job_level_description,) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await HrisUserJobLevel.create({
        job_level_id: generateUUIV4(),
        job_level_name,
        job_level_description,
        created_at,
        updated_at
    });
}



exports.update = async (job_level_id, job_level_name, job_level_description) => {
    const level = await HrisUserJobLevel.findByPk(job_level_id);

    if (!level) throw new Error('job level not found');

    level.set({
        job_level_name,
        job_level_description,
        updated_at: getIsoUTCNow(),
    });

    await level.save();
    return level;
};



exports.delete = async (job_level_id) => {
    const level = await HrisUserJobLevel.findByPk(job_level_id);
    if (!level) throw new Error('job level not found');

    await level.destroy();
    return level;
};