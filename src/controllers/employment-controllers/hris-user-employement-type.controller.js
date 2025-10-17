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


exports.update = async (req, res) => {
    const { employment_type_id } = req.params;
    const {employment_type } = req.body;
    try {
        const employmentType = await hrisUserEmploymentTypeService.update(employment_type_id, employment_type)

        return res.status(200).json({ message: "Updated successfully", employmentType })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    const { employment_type_id } = req.params;

    try {
        const employmentType = await hrisUserEmploymentTypeService.delete(employment_type_id);
        return res.status(200).json({ message: "Deleted successfully", employmentType })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};