const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// mongodb connection
mongoose.connect('mongodb://localhost/makenote-db').then(() => {
  console.log("MongoDb is connected...");
}).catch((err) => {
  console.log(err);
});

// load notes model
require('./models/Notes');
const Notes = mongoose.model('notes');

// Template Engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes - Index page
app.get('/', (req, res) => {
  res.render('index', {
    title: "MakeNote"
  });
});

// Routes - About page
app.get('/about', (req, res) => {
  res.render('about', {
    title: "About"
  });
});

// Routes - Add page
app.get('/notes/create', (req, res) => {
  res.render('notes/create', {
    title: 'Create Note'
  });
});

// post - create a note
app.post('/create', (req, res) => {
  let errors = [];
  if(req.body.title == "") {
    errors.push({text: "Note title is required."});
    res.render('notes/create', {
      errors: errors,
      noteDesc: req.body.desc
    });
  } else if(req.body.desc == "") {
    errors.push({text: "Note description is required."});
    res.render('notes/create', {
      errors: errors,
      noteTitle: req.body.title
    });
  } else {
    res.send('ok');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});