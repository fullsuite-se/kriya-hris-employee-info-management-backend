const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserAttendance = sequelize.define(
    'HrisUserAttendance',
    {
        user_attendance_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id'
            }
        },
        attendance_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time_in: DataTypes.TIME,
        time_out: DataTypes.TIME,
        hours_logged: DataTypes.DECIMAL(10, 2),
        break_start: DataTypes.TIME,
        break_end: DataTypes.TIME,
        total_break_hours: DataTypes.DECIMAL(10, 2),
        hours_rendered: DataTypes.DECIMAL(10, 0),
        undertime_tardiness_hours: DataTypes.DECIMAL(5, 2),
        night_differential_hours: DataTypes.DECIMAL(5, 2),
        absent_day: DataTypes.DECIMAL(5, 2),
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'hris_user_attendances',
        timestamps: false,
    }
);
module.exports = HrisUserAttendance;