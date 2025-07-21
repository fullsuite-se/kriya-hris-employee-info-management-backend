const hrisUserGovernmentIdService = require("../../services/employment-services/hris-user-government-id.service");

exports.getAll = async (req, res) => {
    const { user_id } = req.params;

    try {
        const ids = await hrisUserGovernmentIdService.findAll(user_id);
        return res.status(200).json({ message: "Fetched successfully", ids })
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.getOne = async (req, res) => {
    const { user_government_id } = req.params;
    try {
        const id = await hrisUserGovernmentIdService.findOne(user_government_id);
        return res.status(200).json({ message: "fetched successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.create = async (req, res) => {
    const { user_id } = req.params;
    const { government_id_type_id, government_id_number } = req.body;

    try {
        const id = await hrisUserGovernmentIdService.create(user_id, government_id_type_id, government_id_number);
        return res.status(201).json({ message: "created successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.delete = async (req, res) => {
    const { user_government_id } = req.params;
    try {
        const id = await hrisUserGovernmentIdService.delete(user_government_id);
        return res.status(200).json({ message: "deleted successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.update = async (req, res) => {
    const { user_government_id } = req.params;
    const { government_id_type_id, government_id_number } = req.body;

    try {
        const id = await hrisUserGovernmentIdService.update(user_government_id, government_id_type_id, government_id_number);
        return res.status(200).json({ message: "updated successfully", id });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}