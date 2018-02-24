const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
const port = 5000;

// load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

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

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// connect-flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.err_msg = req.flash('err_msg');
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