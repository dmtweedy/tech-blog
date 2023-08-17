const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connections');
const bcrypt = require('bcrypt');

class User extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 8);
        return newUserData;
      }
    },
    sequelize,
    modelName: 'users'
  }
);

module.exports = User;