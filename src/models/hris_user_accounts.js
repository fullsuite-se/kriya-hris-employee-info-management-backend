const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserAccount = sequelize.define(
    "UserAccount",
    {
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true,
        },
        user_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        user_password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        user_type: {
            type: DataTypes.ENUM,
            values: [
                "OWNER",
                "USER"
            ],
            allowNull: true,
            defaultValue: null,
        },
        user_key: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: null,
        },
        is_verified: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
        is_deactivated: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'hris_user_accounts',
        timestamps: false,

    }
);

module.exports = UserAccount; 