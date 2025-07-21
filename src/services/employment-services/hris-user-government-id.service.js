const { HrisUserGovernmentId } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async (user_id) => {
    return await HrisUserGovernmentId.findAll({ where: { user_id } });
}

exports.findOne = async (user_government_id) => {
    const id = await HrisUserGovernmentId.findByPk(user_government_id);
    if (!id) throw new Error("No id found");

    return id;
}


exports.create = async (user_id, government_id_type_id, government_id_number) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await HrisUserGovernmentId.create({
        user_government_id: generateUUIV4(),
        government_id_type_id,
        government_id_number,
        user_id,
        created_at,
        updated_at
    });
}

exports.delete = async (user_government_id) => {
    const id = await HrisUserGovernmentId.findByPk(user_government_id);

    if (!id) throw new Error("No id found");
    id.destroy();
    id.save();
    return id;

}


exports.update = async (user_government_id, government_id_type_id, government_id_number) => {
    const id = await HrisUserGovernmentId.findByPk(user_government_id);

    if (!id) throw new Error("No id found");

    id.set({
        government_id_type_id,
        government_id_number
    });

    id.save();

    return id;
}