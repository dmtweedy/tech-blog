const express = require('express');
const router = express.Router();
const { Post } = require('../models');

router.get('/dash', async (req, res) => {
  try {
    const userId = req.session.userId;
    const posts = await Post.findAll({ where: { user_id: userId } });
    res.render('dash', { posts, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'error' });
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

module.exports = router;