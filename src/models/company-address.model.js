const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { companyAddressesAddressTypeEnum } = require("../enums/companyEnums");

const CompanyAddress = sequelize.define(
    'CompanyAddress',
    {
        company_addresses_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'companies',
                key: 'company_id',
            }
        },
        address_type: {
            type: DataTypes.ENUM(companyAddressesAddressTypeEnum.MAIN, companyAddressesAddressTypeEnum.BRANCH),
            allowNull: false,
            defaultValue: companyAddressesAddressTypeEnum.MAIN
        },
        floor_bldg_street: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        barangay: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        city_municipality: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        postal_code: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        province_region: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        tableName: 'company_addresses',
        timestamps: false
    }
);

module.exports = CompanyAddress; 