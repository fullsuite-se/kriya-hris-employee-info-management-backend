const hrisUserEmploymentTypeService = require("../../services/employment-services/hris-user-employement-type.service");

exports.getAll = async (req, res) => {
    try {
        const employmentTypes = await hrisUserEmploymentTypeService.findAll();
        return res.status(200).json({ message: "Fetched successfully", employmentTypes });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { employment_type } = req.body;

    try {
        const employmentType = await hrisUserEmploymentTypeService.create(employment_type);
        return res.status(201).json({ message: "Created successfully", employmentType });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}