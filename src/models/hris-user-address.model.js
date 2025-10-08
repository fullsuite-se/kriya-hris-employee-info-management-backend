const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { hrisUserAddressesAddressTypeEnum } = require("../enums/userEnums");

const HrisUserAddress = sequelize.define(
  'HrisUserAddress',
  {
    user_address_id: {
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
      },
    },
    building_num: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    barangay: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    barangayCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cityCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinceCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    regionCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address_type: {
      type: DataTypes.ENUM(
        hrisUserAddressesAddressTypeEnum.CURRENT,
        hrisUserAddressesAddressTypeEnum.PERMANENT
      ),
      allowNull: true,
    },
  },
  {
    tableName: 'hris_user_addresses',
    timestamps: false,
  }
);

module.exports = HrisUserAddress;
