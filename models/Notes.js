const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// create model
mongoose.model('notes', NoteSchema);