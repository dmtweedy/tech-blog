const { sequelize, Post, User, Comment } = require('../models');

(async () => {
  try {
    // Drop tables if they exist and recreate them
    await sequelize.sync({ force: true });

    // Create users
    const users = await User.bulkCreate([
      { username: 'dmtweedy', password: 'tweetybird' },
      { username: 'johndoe', password: 'password2' }
    ]);

    // Create posts
    const posts = await Post.bulkCreate([
      { title: 'What is a CMS-Style Tech Blog?', content: 'A CMS-style blog site similar to a WordPress site, where developers can publish their blog posts and comment on other posts as well.', user_id: users[1].id },
      { title: 'What is MVC?', content: 'MVC is an architectural pattern that separates an application into three main components: the model, the view, and the controller.', user_id: users[1].id },
    ]);

    // Create comments
    await Comment.bulkCreate([
      { content: "Hey, that's what I'm making right now!", post_id: posts[0].id, user_id: users[0].id },
      { content: "That's the structure I'm using to build the Tech Blog!", post_id: posts[1].id, user_id: users[0].id },
    ]);

    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Error dropping, recreating, or seeding data:', error);
  }
})();