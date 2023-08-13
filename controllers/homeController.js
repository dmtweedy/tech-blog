const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
  try {
    const posts = await db.Post.findAll();
    res.render('home', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/post/:postId/comment', (req, res) => {
  // Handle comment submission
});

module.exports = router;