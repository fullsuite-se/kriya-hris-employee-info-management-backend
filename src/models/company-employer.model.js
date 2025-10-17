const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyEmployer = sequelize.define(
    'CompanyEmployer',
    {
        company_employer_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        company_employer_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        }
    },
    {
        tableName: 'company_employers',
        timestamps: false,
    }
);

module.exports = CompanyEmployer; 