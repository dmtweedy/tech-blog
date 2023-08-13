const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {}

User.init(
  {
    // Define user attributes
  },
  {
    sequelize,
    modelName: 'user'
  }
);

module.exports = User;