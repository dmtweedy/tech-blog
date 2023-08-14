const Sequelize = require('sequelize');
const sequelize = require('../config/connection'); // Path to your connection.js

const models = {
  User: sequelize.import('./User'),
  Post: sequelize.import('./Post'),
  Comment: sequelize.import('./Comment'),
  // Define your other models here
};

// Define associations between models if needed
models.Post.hasMany(models.Comment, { foreignKey: 'post_id' });
models.Comment.belongsTo(models.Post, { foreignKey: 'post_id' });

models.Post.belongsTo(models.User, { foreignKey: 'user_id' });
models.User.hasMany(models.Post, { foreignKey: 'user_id' });

module.exports = models;