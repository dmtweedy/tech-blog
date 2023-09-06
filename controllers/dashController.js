const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

router.get('/dash', async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).json({ error: 'User not found' });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    const userPosts = await Post.findAll({ where: { user_id: user.id } });

    console.log('User data:', user);
    console.log('User posts:', userPosts);

    res.render('dash', { username: user.username, userPosts: userPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/create', async (req, res) => {
  try {
    const userId = req.session.userId;
    const { title, content } = req.body;
    await Post.create({
      title,
      content,
      user_id: userId
    });
    res.redirect('/dash');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    res.render('edit', {
      post: {
        dataValues: {
          username: post.username,
          title: post.title,
          content: post.content,
          id: post.id
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.destroy({
      where: { id: postId }
    });
    res.redirect('/dash');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-post', async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.session.userId;
    console.log('User ID from session:', userId);
    
    // Fetch the user from the database using userId
    const user = await User.findByPk(userId);

    if (!user) {
      console.error('User does not exist');
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new post
    const newPost = await Post.create({
      title,
      content,
      user_id: user.id,
      username: user.username
    });
    console.log('User created a new post:', newPost);
    res.redirect('/dash');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;