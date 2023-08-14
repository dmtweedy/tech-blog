const express = require('express');
const session = require('express-session');
const passport = require('passport');
const db = require('./models'); // Adjust the path
const routes = require('./controllers'); // Adjust the path

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});