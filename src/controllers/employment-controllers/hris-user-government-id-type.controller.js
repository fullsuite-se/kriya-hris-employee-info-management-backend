const hrisUserGovernmentIdTypeService = require("../../services/employment-services/hris-user-government-id-type.service");

exports.getAll = async (req, res) => {
    try {
        const idTypes = await hrisUserGovernmentIdTypeService.findAll();
        return res.status(200).json({ message: "Fetched successfully", idTypes });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { government_id_name } = req.body;

    try {
        const idType = await hrisUserGovernmentIdTypeService.create(government_id_name);
        return res.status(200).json({ message: "created successfully", idType });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}