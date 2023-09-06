const express = require('express');
const router = express.Router();
const { Post, Comment, User } = require('../models');

// Display the homepage
app.get('/', (req, res) => {
  res.redirect('/home');
});

router.get('/home', async (req, res) => {
  console.log("in home route");
  try {
    // Fetch all posts with associated user data
    const userPosts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
        },
      ],
    });
    console.log(userPosts);
    res.render('home', { posts: userPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/loghome', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    // Fetch user data based on userId
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all posts (including associated user information)
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'], // Include only the username
        },
        {
          model: Comment,
        },
      ],
    });
    console.log(posts);
    res.render('loghome', { username: user.username, userPosts: posts });
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
    // Fetch the specific post
    const post = await Post.findOne({
      where: { id: postId }});
    if (!postId) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    console.log('Post:', post);
    console.log('Comments:', comments);
    res.render('post', { post, comments, userId });
    console.log(postId, " rendered successfully")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;