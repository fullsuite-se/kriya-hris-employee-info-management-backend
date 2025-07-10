const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserInfo = sequelize.define(
    'HrisUserInfo',
    {
        user_info_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        middle_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        extension_name: {
            type: DataTypes.STRING(3),
            allowNull: true
        },
        sex: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        user_pic: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        personal_email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        contact_number: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    },
    {
        tableName: 'hris_user_infos',
        timestamps: false
    }
);

module.exports = HrisUserInfo; 