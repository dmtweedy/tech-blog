const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
    // Define comment attributes
  },
  {
    sequelize,
    modelName: 'comment'
  }
);

module.exports = Comment;