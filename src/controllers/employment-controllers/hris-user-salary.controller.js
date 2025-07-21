const hrisUserSalaryService = require("../../services/employment-services/hris-user-salary.service");

exports.getOne = async (req, res) => {
    const { user_id } = req.params;
    try {
        const salary = await hrisUserSalaryService.findOne(user_id);
        return res.status(200).json({ message: "Fetched successfully", salary })
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.update = async (req, res) => {
    const { user_id, user_salary_id } = req.params;
    const { base_pay, salary_adjustment_type_id, date } = req.body;

    try {
        const salary = await hrisUserSalaryService.update(user_salary_id, base_pay, salary_adjustment_type_id, date);
        return res.status(200).json({ message: "Updated successfully", salary });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}
