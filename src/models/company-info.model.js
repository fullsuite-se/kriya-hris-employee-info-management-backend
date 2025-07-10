
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { companyInfosBusinessTypeEnum } = require("../enums/companyEnums");

const CompanyInfo = sequelize.define(
    'CompanyInfo',
    {
        company_info_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false
        },
        industry_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        business_type: {
            type: DataTypes.ENUM(
                companyInfosBusinessTypeEnum.SOLE_PROPRIETORSHIP,
                companyInfosBusinessTypeEnum.PARTNERSHIP,
                companyInfosBusinessTypeEnum.CORPORATION,
                companyInfosBusinessTypeEnum.OPC
            ),
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        company_trade_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        company_phone: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        company_brn: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        company_tin: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        employee_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        company_logo: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'company_infos',
        timestamps: false
    }
);

module.exports = CompanyInfo