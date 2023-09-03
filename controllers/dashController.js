const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

router.get('/dash', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    // Fetch user data based on userId
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await Post.findAll({ where: { user_id: userId } });

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

router.get('/dash/edit/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    res.render('edit-post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/edit/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: { id: postId }
      }
    );
    res.redirect('/dash');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dash/delete/:id', async (req, res) => {
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

    // Create a new post
    const newPost = await Post.create({
      title,
      content,
      user_id: userId,
    });

    res.redirect('/dash');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;