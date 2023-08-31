const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models');

// Display the homepage
router.get('/home', async (req, res) => {
  console.log("in home route");
  try {
    const userId = req.session.userId; // Retrieve user ID from session
    
    // Fetch and render existing blog posts
    const posts = await Post.findAll();

    console.log('User logged in. userId:', userId); // Log the correct user ID
    res.render('home', { posts, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Display a single blog post
router.get('/post/:id', async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.params.id;

    // Fetch the specific post and its associated comments
    const post = await Post.findOne({ where: { id: postId } });
    const comments = await Comment.findAll({ where: { post_id: postId } });

    res.render('post', { post, comments, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;