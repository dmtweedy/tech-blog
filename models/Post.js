const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
  {
    // Define post attributes
  },
  {
    sequelize,
    modelName: 'post'
  }
);

module.exports = Post;