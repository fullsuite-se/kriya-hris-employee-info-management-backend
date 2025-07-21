const { HrisUserSalaryAdjustmentType } = require("../../models");
const { getCreatedUpdatedIsoUTCNow } = require("../../utils/date");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    return await HrisUserSalaryAdjustmentType.findAll();
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