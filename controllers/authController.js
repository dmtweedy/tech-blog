const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, Comment } = require('../models');

// Display login form
router.get('/login', (req, res) => {
  console.log("recieved login route")
  res.render('login'); // Render login.handlebars
});

// Handle login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if user exists and compare passwords using bcrypt
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id; // Store user's ID in session
      console.log('User logged in. userId:', user.id);
      res.redirect('/dash');
    } else {
      res.render('login', { errorMessage: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Display signup form
router.get('/signup', (req, res) => {
  res.render('signup'); // Render signup.handlebars
});

// Handle user registration (sign up)
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // Redirect or send a success response
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/comment/:postId', async (req, res) => {
  try {
    const { commentText } = req.body;
    const postId = req.params.postId;
    const userId = req.session.userId; // Assuming you're storing user ID in the session

    if (!userId) {
      return res.redirect('/login'); // Redirect to login page if not logged in
    }

    // Create a new comment
    await Comment.create({
      text: commentText,
      post_id: postId,
      user_id: userId,
    });

    // Redirect back to the single post page
    res.redirect(`/post/${postId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;