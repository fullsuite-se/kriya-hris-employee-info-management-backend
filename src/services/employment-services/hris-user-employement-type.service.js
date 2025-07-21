const { HrisUserEmploymentType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return HrisUserEmploymentType.findAll();
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