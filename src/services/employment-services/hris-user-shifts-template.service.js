const { HrisUserShiftsTemplate } = require("../../models");
const { generateUUIV4 } = require("../../utils/ids");

exports.findAll = async () => {
    const shifts = await HrisUserShiftsTemplate.findAll();
    return shifts;
};

exports.findOne = async (shift_template_id) => {
    const shift = await HrisUserShiftsTemplate.findByPk(shift_template_id);

    if (!shift) throw new Error("No shift template found");

    return shift;
};

exports.create = async (
    day_of_week,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
    flexible,
    shift_name
) => {
    const newShiftTemplate = await HrisUserShiftsTemplate.create({
        shift_template_id: generateUUIV4(),
        day_of_week,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        flexible,
        shift_name
    });
    return newShiftTemplate;
};

exports.delete = async (shift_template_id) => {
    const shift = await HrisUserShiftsTemplate.findByPk(shift_template_id);

    if (!shift) throw new Error("No shift template found");

    shift.destroy();
    shift.save();

    return shift;
};

exports.update = async (
    shift_template_id,
    day_of_week,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
    flexible,
    shift_name
) => {
    const shift = await HrisUserShiftsTemplate.findByPk(shift_template_id);

    if (!shift) throw new Error("No shift template found");

    shift.set({
        day_of_week,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        flexible,
        shift_name
    });
    shift.save();

    return shift;
};
