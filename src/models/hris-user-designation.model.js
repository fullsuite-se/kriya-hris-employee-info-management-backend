const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserDesignation = sequelize.define(
    'HrisUserDesignation',
    {
        user_designation_id: {
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
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'companies',
                key: 'company_id',
            }
        },
        user_shift_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_shifts',
                key: 'user_shift_id',
            }
        },
        job_title_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'company_job_titles',
                key: 'job_title_id',
            }
        },
        department_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'company_departments',
                key: 'department_id',
            }
        },
        division_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'company_divisions',
                key: 'division_id',
            }
        },
        upline_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        }
    },
    {
        tableName: 'hris_user_designations',
        timestamps: false
    }
);

module.exports = HrisUserDesignation; 