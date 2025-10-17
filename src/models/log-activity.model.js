const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LogsActivity = sequelize.define(
  'LogsActivity',
  {
    logs_activities_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    service_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'services',
        key: 'service_id',
      }
    },
    company_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'companies',
        key: 'company_id',
      }
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'hris_user_accounts',
        key: 'user_id',
      }
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW()
    }
  },
  {
    tableName: 'logs_activities',
    timestamps: false
  }
);

module.exports = LogsActivity;