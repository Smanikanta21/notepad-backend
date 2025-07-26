const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
} , {
  timestamps: true
});

const Notes =  mongoose.model('Note', noteSchema);
module.exports = Notes;