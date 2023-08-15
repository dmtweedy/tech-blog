const express = require('express');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./controllers/authController');
const dashRoutes = require('./controllers/dashController');
const homeRoutes = require('./controllers/homeController');

app.use(authRoutes);
app.use(dashRoutes);
app.use(homeRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
