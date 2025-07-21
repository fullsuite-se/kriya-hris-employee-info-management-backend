const hrisUserHr201Service = require("../../services/employment-services/hris-user-hr201.service");

exports.getOne = async (req, res) => {
    const { user_id } = req.params;
    try {
        const hr201 = await hrisUserHr201Service.findOne(user_id);
        return res.status(200).json({ message: "Fetched successfully", hr201 });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}

exports.update = async (req, res) => {
    const { user_id } = req.params;
    const { hr201_url } = req.body;

    try {
        const hr201 = await hrisUserHr201Service.update(user_id, hr201_url);
        return res.status(200).json({ message: "updated successfully", hr201 });
    } catch (error) {
        return res.status(500).json({ message: "Failed", error: error.message });
    }
}