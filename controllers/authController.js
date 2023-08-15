const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');

// Display login form
router.get('/login', (req, res) => {
  res.render('login'); // Render login.handlebars
});

// Handle login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await db.User.findOne({ where: { username } });

    // Check if user exists and compare passwords using bcrypt
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id; // Store user's ID in session
      res.redirect('/dashboard');
    } else {
      res.redirect('/login'); // Redirect back to login if authentication fails
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

// Handle signup form submission
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user with hashed password
    await db.User.create({
      username,
      password: hashedPassword
    });

    res.redirect('/dashboard'); // Redirect to dashboard after successful signup
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;