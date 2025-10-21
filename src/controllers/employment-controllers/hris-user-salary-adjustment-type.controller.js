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



exports.update = async (req, res) => {
    const { salary_adjustment_type_id } = req.params;
    const { salary_adjustment_type } = req.body;
    try {
        const adjustment = await hrisUserSalaryAdjustmentTypeService.update(salary_adjustment_type_id, salary_adjustment_type)

        return res.status(200).json({ message: "Updated successfully", adjustment })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    const { salary_adjustment_type_id } = req.params;

    try {
        const adjustment = await hrisUserSalaryAdjustmentTypeService.delete(salary_adjustment_type_id);
        return res.status(200).json({ message: "Deleted successfully", adjustment })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};