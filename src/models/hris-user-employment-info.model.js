const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserEmploymentInfo = sequelize.define(
    'HrisUserEmploymentInfo',
    {
        user_employment_info_id: {
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
        shift_template_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_shifts_templates',
                key: 'shift_template_id',
            }
        },
        date_hired: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW()
        },
        date_regularization: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        date_offboarding: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        date_separated: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        employment_status_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_employment_statuses',
                key: 'employment_status_id',
            }
        },
        job_level_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_job_levels',
                key: 'job_level_id',
            }
        },
        employment_type_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
            references: {
                model: 'hris_user_employment_types',
                key: 'employment_type_id',
            }
        }
    },
    {
        tableName: 'hris_user_employment_infos',
        timestamps: false
    }
);

module.exports = HrisUserEmploymentInfo; 