const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

// method-override middleware
app.use(methodOverride('_method'));

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

// Routes - Notes page
app.get('/notes', (req, res) => {
  Notes.find({}).sort({
    date: 'desc'
  }).then((notes) => {
    res.render('notes/index', {
      notes: notes,
      header: "Notes"
    });
  });
});

// Routes - Add page
app.get('/notes/create', (req, res) => {
  res.render('notes/create', {
    title: 'Create Note'
  });
});

// Routes - Edit page
app.get('/notes/edit/:id', (req, res) => {
  Notes.findOne({
    _id: req.params.id
  }).then((note) => {
    res.render('notes/edit', {
      title: 'Edit Note',
      note: note
    });
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
    const newNote = {
      title: req.body.title,
      details: req.body.desc
    };
    new Notes(newNote).save().then((note) => {
      console.log(note);
      res.redirect('/notes');
    });
  }
});

// Updating note
app.put('/notes/:id', (req, res) => {
  Notes.findOne({
    _id: req.params.id
  }).then((note) => {
    note.title = req.body.title;
    note.details = req.body.desc;
    note.save().then((note) => {
      res.redirect('/notes');
    });
  });
});

// deleting note
app.delete('/notes/:id', (req, res) => {
  Notes.remove({
    _id: req.params.id
  }).then(() => {
    res.redirect('/notes');
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});