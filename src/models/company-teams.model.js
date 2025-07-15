const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CompanyTeam = sequelize.define(
    'CompanyTeam',
    {
        team_id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            references: {
                model: 'companies',
                key: 'company_id',
            }
        },
        team_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        team_description: {
            type: DataTypes.TEXT,
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
        tableName: 'company_teams',
        timestamps: false,
    }
);

module.exports = CompanyTeam; 