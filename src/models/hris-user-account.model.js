const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { hrisUserAccountsUserTypeEnum } = require("../enums/userEnums");

const HrisUserAccount = sequelize.define(
    'HrisUserAccount',
    {
        user_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
            // references: {
            //     model: 'hris_user_designations',
            //     key: 'user_id',
            // }
        },
        user_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        user_type: {
            type: DataTypes.ENUM(hrisUserAccountsUserTypeEnum.OWNER, hrisUserAccountsUserTypeEnum.USER),
            defaultValue: hrisUserAccountsUserTypeEnum.USER
        },
        user_key: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        is_verified: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        is_deactivated: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW()
        },
        created_by: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        }
    },
    {
        tableName: 'hris_user_accounts',
        timestamps: false
    }
);

module.exports = HrisUserAccount; 