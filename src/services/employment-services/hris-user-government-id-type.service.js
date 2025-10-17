const { HrisUserGovernmentIdType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return HrisUserGovernmentIdType.findAll({
        order: [['government_id_name', 'ASC']]
    });
}

exports.create = async (government_id_name) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await HrisUserGovernmentIdType.create({
        government_id_type_id: generateUUIV4(),
        government_id_name,
        created_at,
        updated_at,
    });
}