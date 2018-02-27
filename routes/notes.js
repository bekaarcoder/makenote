const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// load notes model
require('../models/Notes');
const Notes = mongoose.model('notes');

// Routes - Notes page
router.get('/', ensureAuthenticated, (req, res) => {
  Notes.find({
    user: req.user.id
  }).sort({
    date: 'desc'
  }).then((notes) => {
    res.render('notes/index', {
      notes: notes,
      header: "Notes"
    });
  });
});

// Routes - Add page
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('notes/create', {
    title: 'Create Note'
  });
});

// Routes - Edit page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Notes.findOne({
    _id: req.params.id
  }).then((note) => {
    if(note.user !== req.user.id) {
      req.flash('err_msg', 'You are not authorized.');
      res.redirect('/notes');
    } else {
      res.render('notes/edit', {
        title: 'Edit Note',
        note: note
      });
    }
  });
});

// post - create a note
router.post('/create', ensureAuthenticated, (req, res) => {
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
      details: req.body.desc,
      user: req.user.id
    };
    new Notes(newNote).save().then((note) => {
      console.log(note);
      req.flash('success_msg', 'Note has been created successfully.');
      res.redirect('/notes');
    });
  }
});

// Updating note
router.put('/:id', ensureAuthenticated, (req, res) => {
  Notes.findOne({
    _id: req.params.id
  }).then((note) => {
    note.title = req.body.title;
    note.details = req.body.desc;
    note.save().then((note) => {
      req.flash('success_msg', 'Note has been updated successfully.');
      res.redirect('/notes');
    });
  });
});

// deleting note
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Notes.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Note has been deleted successfully.');
    res.redirect('/notes');
  });
});


module.exports = router;