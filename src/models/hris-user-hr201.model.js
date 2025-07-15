const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HrisUserHr201 = sequelize.define(
    'HrisUserHr201',
    {
        hr201_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'hris_user_accounts',
                key: 'user_id',
            }
        },
        hr201_url: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'hris_user_hr201',
        timestamps: false,
    }
);

module.exports = HrisUserHr201;