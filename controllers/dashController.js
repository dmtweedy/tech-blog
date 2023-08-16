const express = require('express');
const router = express.Router();

const { Post } = require('../models');

// Middleware function to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login'); // Redirect to login if not authenticated
}

router.get('/dash', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const posts = await Post.findAll({ where: { user_id: userId } });
    res.render('dash', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/create', isAuthenticated, async (req, res) => {
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

router.get('/dash/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    res.render('edit-post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/edit/:id', isAuthenticated, async (req, res) => {
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

router.get('/dash/delete/:id', isAuthenticated, async (req, res) => {
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