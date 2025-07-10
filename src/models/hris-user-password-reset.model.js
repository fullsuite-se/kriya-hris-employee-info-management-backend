
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserPasswordReset = sequelize.define(
    'HrisUserPasswordReset',
    {
        password_reset_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        otp_code: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'hris_user_password_resets',
        timestamps: false
    }
);

module.exports = HrisUserPasswordReset; 