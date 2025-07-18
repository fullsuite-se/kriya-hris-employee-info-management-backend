const companyDepartmentService = require("../../services/company-services/company-department.service");

exports.getAll = async (req, res) => {
    const { company_id } = req.params;

    try {
        const departments = await companyDepartmentService.findAll(company_id);
        return res.status(200).json({ message: "Fetched successfully", departments })
    } catch (error) {
        return res.status(500).json({ message: error.message, error: error.message });
    }
};

exports.getOne = async (req, res) => {
    const { department_id } = req.params;

    try {
        const department = await companyDepartmentService.findOne(department_id);
        return res.status(200).json({ message: "Fetched successully", department });
    } catch (error) {
        return res.status(500).json({ message: error.message, error: error.message });
    }
};

exports.create = async (req, res) => {
    const { company_id } = req.params;
    const { department_name } = req.body;

    try {
        const department = await companyDepartmentService.create(company_id, department_name);
        return res.status(201).json({ message: "Created successfully", department });
    } catch (error) {
        return res.status(400).json({ message: error.message, error: error.message });
    }
};

exports.update = async (req, res) => {
    const { department_id } = req.params;
    const { department_name } = req.body;

    try {
        const department = await companyDepartmentService.update(department_id, department_name);
        return res.status(200).json({ message: "Updated successfully", department });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { department_id } = req.params;

    try {
        const department = await companyDepartmentService.delete(department_id);
        return res.json({ message: 'Department deleted successfully', department });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};