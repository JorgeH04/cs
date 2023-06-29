const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
  charge: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('tasks', TaskSchema);

 