const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyDepartment = sequelize.define(
    'CompanyDepartment',
    {
        department_id: {
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
        department_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'company_departments',
        timestamps: false
    }
);

module.exports = CompanyDepartment; 