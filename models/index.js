const Sequelize = require('sequelize');
const sequelize = require('../config/connections');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

const models = {
  User,
  Post,
  Comment,
};

// Define associations between models if needed
models.User.hasMany(models.Post, { foreignKey: 'user_id' });
models.Post.belongsTo(models.User, { foreignKey: 'user_id' });

models.Post.hasMany(models.Comment, { foreignKey: 'post_id' });
models.Comment.belongsTo(models.Post, { foreignKey: 'post_id' });

module.exports = {
  sequelize,
  models
};