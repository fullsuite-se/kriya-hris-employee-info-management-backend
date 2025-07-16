const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserOvertimeType = sequelize.define(
    'HrisUserOvertimeType',
    {
        overtime_type_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        overtime_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        overtime_rate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
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
        tableName: 'hris_user_overtime_types',
        timestamps: false,
    }
);
module.exports = HrisUserOvertimeType;