const { HrisUserJobLevel } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserJobLevel.findAll();
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