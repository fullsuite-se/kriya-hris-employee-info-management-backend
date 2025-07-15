const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserGovernmentId = sequelize.define(
    'HrisUserGovernmentId',
    {
        user_government_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        government_id_type_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        government_id_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.CHAR(36),
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
        },
    },
    {
        tableName: 'hris_user_government_ids',
        timestamps: false,
    }
);

module.exports = HrisUserGovernmentId; 