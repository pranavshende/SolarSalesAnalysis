const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SolarData = sequelize.define('SolarData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'All'
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  capacity_kW: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  revenue_Cr: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  datasetVersion: {
    type: DataTypes.STRING,
    defaultValue: '1.0.0'
  },
  uploadedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  indexes: [
    {
      fields: ['state', 'year']
    },
    {
      fields: ['state', 'city', 'year']
    }
  ]
});

module.exports = SolarData;
