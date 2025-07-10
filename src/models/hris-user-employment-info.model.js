const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { hrisUserEmploymentInfosEmploymentStatusEnum } = require("../enums/userEnums");

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
        date_hired: {
            type: DataTypes.DATEONLY,
            allowNull: false
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
        employment_status: {
            type: DataTypes.ENUM(
                hrisUserEmploymentInfosEmploymentStatusEnum.PROBATIONARY,
                hrisUserEmploymentInfosEmploymentStatusEnum.REGULAR,
                hrisUserEmploymentInfosEmploymentStatusEnum.PART_TIME,
                hrisUserEmploymentInfosEmploymentStatusEnum.INTERN,
                hrisUserEmploymentInfosEmploymentStatusEnum.CONTRACTUAL,
                hrisUserEmploymentInfosEmploymentStatusEnum.RETIRED,
                hrisUserEmploymentInfosEmploymentStatusEnum.RESIGNED,
                hrisUserEmploymentInfosEmploymentStatusEnum.TERMINATED
            ),
            allowNull: false
        }
    },
    {
        tableName: 'hris_user_employment_infos',
        timestamps: false
    }
);

module.exports = HrisUserEmploymentInfo; 