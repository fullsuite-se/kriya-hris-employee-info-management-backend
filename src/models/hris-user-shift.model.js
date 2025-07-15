const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserShift = sequelize.define(
    'HrisUserShift',
    {
        user_shift_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        shift_template_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_shifts_templates',
                key: 'shift_template_id',
            }
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        }
    },
    {
        tableName: 'hris_user_shifts',
        timestamps: false
    }
);

module.exports = HrisUserShift; 