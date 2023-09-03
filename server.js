const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connections');
const exphbs = require('express-handlebars');
const db = require('./models');
const path = require('path');
const helpers = require('./utils/helpers');
const app = express();
const PORT = process.env.PORT || 3002;
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: false,
    allowProtoMethodsByDefault: false,
    helpers
  },
});

app.set('views', path.join(__dirname, 'views'));
app.engine(
  'handlebars', hbs.engine
);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Middleware to load user information
app.use(async (req, res, next) => {
  if (req.session.userId) {
    const user = await db.User.findByPk(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
});

// Routes
const authRoutes = require('./controllers/authController');
const dashRoutes = require('./controllers/dashController');
const homeRoutes = require('./controllers/homeController');

app.use(authRoutes);
app.use(dashRoutes);
app.use(homeRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on homepage! http://localhost:${PORT}/home`);
  });
})
.catch((err) => {
  console.error('Error synchronizing database:', err);
});
