const { sequelize, Post, User, Comment } = require('../models');

(async () => {
  try {
    // Drop tables if they exist and recreate them
    await sequelize.sync({ force: true });

    // Create users
    const user1 = await User.create({ username: 'dmtweedy', password: 'tweetybird' });
    const user2 = await User.create({ username: 'johndoe', password: 'password2' });

    // Create posts
    const post1 = await Post.create({
      title: 'What is a CMS-Style Tech Blog?',
      content: 'A CMS-style blog site similar to a WordPress site, where developers can publish their blog posts and comment on other posts as well.',
      user_id: user2.username 
    });

    const post2 = await Post.create({
      title: 'What is MVC?',
      content: 'MVC is an architectural pattern that separates an application into three main components: the model, the view, and the controller.',
      user_id: user2.username
    });

    // Create comments
    await Comment.create({
      text: "Hey, that's what I'm making right now!",
      post_id: post1.id,
      user_id: user1.username
    });

    await Comment.create({
      text: "That's the structure I'm using to build the Tech Blog!",
      post_id: post1.id,
      user_id: user1.username
    });

    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Error dropping, recreating, or seeding data:', error);
  }
})();
