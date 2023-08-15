const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const db = require('./models');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

// Routes
const authRoutes = require('./controllers/authController');
const dashRoutes = require('./controllers/dashController');
const homeRoutes = require('./controllers/homeController');

app.use(authRoutes);
app.use(dashRoutes);
app.use(homeRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on the homepage! http://localhost:${PORT}/`);
  });
})
.catch((err) => {
  console.error('Error synchronizing database:', err);
});
