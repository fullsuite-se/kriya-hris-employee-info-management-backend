const hrisUserSalaryAdjustmentTypeService = require("../../services/employment-services/hris-user-salary-adjustment-type.service");

exports.getAll = async (req, res) => {
    try {
        const adjustments = await hrisUserSalaryAdjustmentTypeService.findAll();
        return res.status(200).json({ message: "fetched successfully", adjustments });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { salary_adjustment_type } = req.body;

    try {
        const adjustment = await hrisUserSalaryAdjustmentTypeService.create(salary_adjustment_type);
        return res.status(200).json({ message: "Updated successfully", adjustment });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}