const { HrisUserEmploymentStatus } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserEmploymentStatus.findAll();
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