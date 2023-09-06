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
    console.log('Received username:', username);
    console.log('Received password:', password);
    const user = await User.findOne({ where: { username } });
    console.log('User found:', user);

    const storedPassword = user.password.trim();
    const inputPassword = password.trim();

    console.log('Stored Password Hash:', storedPassword);
    console.log('Password Comparison Result:', bcrypt.compareSync(inputPassword, storedPassword));

    await new Promise((resolve, reject) => {
      req.session.reload((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
    if (user && bcrypt.compareSync(inputPassword, storedPassword)) {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.save(() => {
        console.log('User logged in. userId:', user.id);
        res.redirect('/dash');
      });
    } else {
      console.log("Error logging in. User not found or incorrect password.");
      res.render('login');
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

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password,
    });
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    console.log('New user created:', newUser);
    // Redirect or send a success response
    req.session.save(() => {
      console.log('User logged in. userId:', newUser.id);
      res.redirect('/dash');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/comment/:postId', async (req, res) => {
  try {
    const { commentText } = req.body;
    const postId = req.params.postId;
    const userId = req.session.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.redirect('/login'); // Redirect to login page if not logged in
    }

    // Create a new comment
    await Comment.create({
      text: commentText,
      post_id: postId,
      user_id: user.id,
      username: user.username
    });
    // Redirect back to the single post page
    res.redirect(`/post/${postId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define logout route
router.get('/logout', (req, res) => {
  // Render logout page
  res.render('logout');
});

// Handle logout form
router.post('/logout', async (req, res) => {
  try {
    // Ensure that session data is fully loaded
    await new Promise((resolve, reject) => {
      req.session.reload((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Clear user's session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      // Redirect user to home page
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;