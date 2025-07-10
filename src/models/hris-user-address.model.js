const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { hrisUserAddressesAddressTypeEnum } = require("../enums/userEnums");

const HrisUserAddress = sequelize.define(
    'HrisUserAddress',
    {
        user_address_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        building_num: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        street: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        barangay: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        province: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        region: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        address_type: {
            type: DataTypes.ENUM(hrisUserAddressesAddressTypeEnum.CURRENT, hrisUserAddressesAddressTypeEnum.PERMANENT),
            allowNull: false
        }
    },
    {
        tableName: 'hris_user_addresses',
        timestamps: false
    }
);

module.exports = HrisUserAddress;