const express = require('express');
const router = express.Router();
const db = require('../models');

// Display login form
router.get('/login', (req, res) => {
  res.render('login'); // Render login.handlebars
});

// Handle login form submission
router.post('/login', async (req, res) => {
  try {
    // Authenticate user and set session
    // Redirect user to dashboard or show error message
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
    // Create new user and set session
    // Redirect user to dashboard or show error message
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;