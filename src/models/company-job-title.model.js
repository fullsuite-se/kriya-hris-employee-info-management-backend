

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyJobTitle = sequelize.define(
    'CompanyJobTitle',
    {
        job_title_id: {
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
        job_title: {
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
        tableName: 'company_job_titles',
        timestamps: false
    }
);

module.exports = CompanyJobTitle;