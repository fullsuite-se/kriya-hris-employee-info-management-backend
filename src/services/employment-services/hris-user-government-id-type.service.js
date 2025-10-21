const { HrisUserGovernmentIdType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
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


exports.update = async (government_id_type_id, government_id_name) => {
    const idType = await HrisUserGovernmentIdType.findByPk(government_id_type_id);

    if (!idType) throw new Error('government_id_name not found');

    idType.set({
        government_id_name,
        updated_at: getIsoUTCNow(),
    });

    await idType.save();
    return idType;
};



exports.delete = async (government_id_type_id) => {
    const idType = await HrisUserGovernmentIdType.findByPk(government_id_type_id);
    if (!idType) throw new Error('government_id_name not found');

    await idType.destroy();
    return idType;
};