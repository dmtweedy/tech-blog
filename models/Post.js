const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connections');
const User = require('./User');

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'username', 
      }
    }
  },
  {
    sequelize,
    modelName: 'posts'
  }
);

module.exports = Post;