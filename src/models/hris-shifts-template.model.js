

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisShiftsTemplate = sequelize.define(
    'HrisShiftsTemplate',
    {
        shift_template_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        day_of_week: {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        break_start_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        break_end_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        flexible: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
    {
        tableName: 'hris_shifts_templates',
        timestamps: false
    }
);

module.exports = HrisShiftsTemplate;