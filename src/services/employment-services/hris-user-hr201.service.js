const { HrisUserHr201 } = require("../../models");
const { getIsoUTCNow } = require("../../utils/date");

exports.findOne = async (user_id) => {
    const hr201 = await HrisUserHr201.findOne({ where: { user_id } });
    if (!hr201) throw new Error("No hr201 found");
    return hr201;
}

exports.update = async (user_id, hr201_url) => {
    const hr201 = await HrisUserHr201.findOne({ where: { user_id } });
    if (!hr201) throw new Error("No hr201 found");

    hr201.set({
        hr201_url,
        updated_at: getIsoUTCNow(),
    });

    hr201.save();
    return hr201;
}