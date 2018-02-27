const express = require('express');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
const port = 5000;

// load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// mongodb connection
mongoose.connect('mongodb://localhost/makenote-db').then(() => {
  console.log("MongoDb is connected...");
}).catch((err) => {
  console.log(err);
});

// Template Engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-validator midleware
app.use(expressValidator());

// to access static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// passport middleware - always put after session middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.err_msg = req.flash('err_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Routes - Index page
app.get('/', (req, res) => {
  res.render('index', {
    header: "MakeNote"
  });
});

// Routes - About page
app.get('/about', (req, res) => {
  res.render('about', {
    header: "About"
  });
});

// use routes
app.use('/notes', notes);
app.use('/users', users);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});