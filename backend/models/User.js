const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const userId = this._id;
  const User = mongoose.model('User');
  const Question = mongoose.model('Question');
  const Answer = mongoose.model('Answer');
  const Vote = mongoose.model('Vote');
  const UserSession = mongoose.model('UserSession');
  const Announcement = mongoose.model('Announcement');

  const user = await User.findById(userId);
  const isAdmin = user?.role === 'admin';

  // 1. Kullanıcının oy verdiği tüm Vote kayıtlarını bul
  const votes = await Vote.find({ user: userId });

  // 2. Oy verdiği objelerin upvote sayılarını düşür
  for (const vote of votes) {
    if (vote.refType === 'Question') {
      await Question.findByIdAndUpdate(vote.refId, { $inc: { upvotes: -1 } });
    } else if (vote.refType === 'Answer') {
      await Answer.findByIdAndUpdate(vote.refId, { $inc: { upvotes: -1 } });
    }
  }

  // 3. Diğer bağlı içerikleri sil
  const deletions = [
    Question.deleteMany({ author: userId }),
    Answer.deleteMany({ author: userId }),
    Vote.deleteMany({ user: userId }),
    UserSession.deleteMany({ user: userId })
  ];

  if (isAdmin) {
    deletions.push(Announcement.deleteMany({ createdBy: userId }));
  }

  await Promise.all(deletions);
  next();
});



module.exports = mongoose.model('User', UserSchema);
