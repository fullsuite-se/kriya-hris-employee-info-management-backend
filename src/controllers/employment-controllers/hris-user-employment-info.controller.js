const { findOne, update } = require("../../services/employment-services/hris-user-employment-info.service");

exports.getOne = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    try {
        const employement = await findOne(user_id);
        return res.status(200).json({ message: "Successfully fetched", employement });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch employee info", error: error.message });
    }
}

exports.update = async (req, res) => {
    const { user_id } = req.params;

    const {
        shift_template_id,
        date_hired,
        date_regularization,
        date_offboarding,
        date_separated,
        employment_status_id,
        job_level_id,
        employment_type_id } = req.body;

    if (!user_id) return res.status(400).json({ message: "The client sent a malformed or incomplete request" })

    try {
        const employement = await update(user_id, shift_template_id, date_hired, date_regularization, date_offboarding, date_separated, employment_status_id, job_level_id, employment_type_id);
        return res.status(200).json({ message: "Employment info updated successfully", employement });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch employee info", error: error.message });
    }
}

