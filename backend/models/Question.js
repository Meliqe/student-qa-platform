const mongoose = require('mongoose');
const slugify = require('slugify');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  tags: {
    type: [String],
    required: [true, 'Please add at least one tag'],
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 5;
      },
      message: 'Please add between 1 and 5 tags'
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bestAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create question slug from the title
QuestionSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Benzersiz slug bulana kadar dene
  while (await this.constructor.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
  next();
});

// Cascade delete answers when a question is deleted
QuestionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Answer').deleteMany({ question: this._id });
  next();
});

// Reverse populate with answers
QuestionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question',
  justOne: false
});

module.exports = mongoose.model('Question', QuestionSchema);
