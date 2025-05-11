const mongoose = require('mongoose');

const VisitCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('VisitCounter', VisitCounterSchema);
