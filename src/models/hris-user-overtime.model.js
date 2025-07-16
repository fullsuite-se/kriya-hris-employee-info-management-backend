const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserOvertime = sequelize.define(
    'HrisUserOvertime',
    {
        hris_user_overtime_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        requester_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id'
            }
        },
        approver_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        overtime_type_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_overtime_types',
                key: 'overtime_type_id'
            }
        },
        filed_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        date_filed: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'hris_user_overtimes',
        timestamps: false,
    }
);

module.exports = HrisUserOvertime; 