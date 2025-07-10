
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { companiesStatusEnum } = require("../enums/companyEnums");

const Company = sequelize.define(
    'Company',
    {
        company_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        company_email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(companiesStatusEnum.ACTIVE, companiesStatusEnum.INACTIVE),
            allowNull: false,
            defaultValue: companiesStatusEnum.INACTIVE
        },
        date_added: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'companies',
        timestamps: false
    }
);

module.exports = Company; 