const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const withAuth = require('../public/auth');

router.get('/dash', withAuth, async (req, res) => {
  try {
    // Fetch and render posts
    const userId = req.session.userId; // Retrieve user ID
    const posts = await Post.findAll({ where: { user_id: userId } });
    res.render('dash', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/create', async (req, res) => {
  // Handle form submission to create a new post
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


router.get('/dash/edit/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the post to edit
    const post = await Post.findByPk(postId);

    res.render('edit-post', { post }); // Render a form to edit a post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/dash/edit/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Update the post
    await Post.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: { id: postId }
      }
    );

    res.redirect('/dash'); // Redirect to dashboard after editing a post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dash/delete/:id', withAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete the post
    await Post.destroy({
      where: { id: postId }
    });

    res.redirect('/dash'); // Redirect to dashboard after deleting a post
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;