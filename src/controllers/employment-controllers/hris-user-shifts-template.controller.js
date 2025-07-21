const shiftTemplateService = require("../../services/employment-services/hris-user-shifts-template.service");

exports.getAll = async (req, res) => {
    try {
        const shifts = await shiftTemplateService.findAll();
        return res.status(200).json({ message: "Successfully fetched", shifts });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
};


exports.getOne = async (req, res) => {
    const { shift_template_id } = req.params;
    try {
        const shifts = await shiftTemplateService.findOne(shift_template_id);
        return res.status(200).json({ message: "Successfully fetched", shifts });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
};


exports.create = async (req, res) => {
    const {
        day_of_week,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        flexible,
        shift_name
    } = req.body;

    try {
        const shift = await shiftTemplateService.create(
            day_of_week,
            start_time,
            end_time,
            break_start_time,
            break_end_time,
            flexible,
            shift_name
        );
        res.status(201).json({ message: "created successfully", shift })
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { shift_template_id } = req.params;

        const shift = await shiftTemplateService.delete(shift_template_id);

        res.json({ message: "Shift template deleted successfully", shift });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
};

exports.update = async (req, res) => {
    const { shift_template_id } = req.params;
    const {
        day_of_week,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        flexible,
        shift_name
    } = req.body;

    try {
        const shift = await shiftTemplateService.update(
            shift_template_id,
            day_of_week,
            start_time,
            end_time,
            break_start_time,
            break_end_time,
            flexible,
            shift_name,
        );

        return res.status(200).json({ message: "Updated successfully", shift });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
};

