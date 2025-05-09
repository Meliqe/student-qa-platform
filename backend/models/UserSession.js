const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: true
  }
});

// Bir kullanıcının sadece bir aktif oturumu olabilir
UserSessionSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('UserSession', UserSessionSchema);
