const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Referans tipi (Question veya Answer)
  refType: {
    type: String,
    enum: ['Question', 'Answer'],
    required: true
  },
  // Referans ID'si (Question veya Answer ID'si)
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'refType'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Bir kullanıcı bir soru veya cevaba sadece bir kez oy verebilir
VoteSchema.index({ user: 1, refType: 1, refId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
