const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models');

// Display the homepage
router.get('/home', async (req, res) => {
  try {
    // Fetch and render existing blog posts
    const posts = await Post.findAll();
    res.render('home', { posts }); // Render the 'home' view and pass the 'posts' data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Display a single blog post
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the specific post and its associated comments
    const post = await Post.findOne({ where: { id: postId } });
    const comments = await Comment.findAll({ where: { post_id: postId } });

    res.render('post', { post, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;