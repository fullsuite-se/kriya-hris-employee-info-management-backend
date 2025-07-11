
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyIndustry = sequelize.define(
    'CompanyIndustry',
    {
        industry_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false
        },
        industry_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        }
    },
    {
        tableName: 'company_industries',
        timestamps: false
    }
);

module.exports = CompanyIndustry;