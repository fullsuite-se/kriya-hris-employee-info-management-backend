const { HrisUserSalary } = require("../../models");
const { getIsoUTCNow } = require("../../utils/date");

//we can easily update this into findMany since we're using user_id as the reference
exports.findOne = async (user_id) => {
    const salary = await HrisUserSalary.findOne({ where: user_id });

    if (!salary) throw new Error("No salary found");

    return salary;
}

exports.update = async (
    user_salary_id,
    base_pay,
    salary_adjustment_type_id,
    date_salary_created,
) => {
    const salary = await HrisUserSalary.findByPk(user_salary_id);

    if (!salary) throw new Error("No salary found");

    salary.set({
        base_pay,
        salary_adjustment_type_id,
        date_salary_created,
        updated_at: getIsoUTCNow(),
    });
    salary.save();
    return salary;
}