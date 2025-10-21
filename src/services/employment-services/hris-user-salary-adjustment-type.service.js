const { HrisUserSalaryAdjustmentType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow, getIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserSalaryAdjustmentType.findAll({
        order: [['salary_adjustment_type', 'ASC']]
    });
}

exports.create = async (salary_adjustment_type) => {
    const { created_at, updated_at } = getCreatedUpdatedIsoUTCNow();

    return await HrisUserSalaryAdjustmentType.create({
        salary_adjustment_type_id: generateUUIV4(),
        salary_adjustment_type,
        created_at,
        updated_at
    });
}




exports.update = async (salary_adjustment_type_id, salary_adjustment_type) => {
    const adjustment = await HrisUserSalaryAdjustmentType.findByPk(salary_adjustment_type_id);

    if (!adjustment) throw new Error('salary_adjustment_type not found');

    adjustment.set({
        salary_adjustment_type,
        updated_at: getIsoUTCNow(),
    });

    await adjustment.save();
    return adjustment;
};



exports.delete = async (salary_adjustment_type_id) => {
    const adjustment = await HrisUserSalaryAdjustmentType.findByPk(salary_adjustment_type_id);
    if (!adjustment) throw new Error('salary_adjustment_type not found');

    await adjustment.destroy();
    return adjustment;
};