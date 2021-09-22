const path = require('path');
const express = require('express');
const sequelize = require('./config/connection');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const layouts = require('handlebars-layouts');
const {checkAuthenticated} = require('./utils/auth');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//initiate handlebars for express
const hbs = exphbs.create({
});

//Register handlebar-layouts helpers on handlebars
hbs.handlebars.registerHelper(layouts(hbs.handlebars));

const app = express();
const PORT = process.env.PORT || 3001;

// give app access to env variables
app.locals.ENV = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure and link a session object with the sequelize store
const sess = {
    secret: process.env.SESSION_SECRET || 'Test Session Secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

// Add express-session and store as Express.js middleware
app.use(session(sess));

// Check if user is authenticated and if so pass session details to local vars
app.use(checkAuthenticated);

// Set Handlebars as the default template engine.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Serve up the public folder on the root
app.use(express.static(path.join(__dirname, 'public')));

// use the routes in the route folder
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
});
