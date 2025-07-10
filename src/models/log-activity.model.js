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
      allowNull: false
    },
    company_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
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
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'logs_activities',
    timestamps: false
  }
);

module.exports = LogsActivity;