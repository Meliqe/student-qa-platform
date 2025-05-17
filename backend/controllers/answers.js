const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Vote = require('../models/Vote');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get answers for a question
// @route   GET /api/questions/:questionId/answers
// @access  Public
exports.getAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate({
        path: 'author',
        select: 'name'
      });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add answer to question
// @route   POST /api/questions/:questionId/answers
// @access  Private
exports.addAnswer = async (req, res, next) => {
  try {
    // Add question and user to req.body
    req.body.question = req.params.questionId;
    req.body.author = req.user.id;

    // Check if question exists
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return next(new ErrorResponse('Question not found', 404));
    }

    const answer = await Answer.create(req.body);

    res.status(201).json({
      success: true,
      data: answer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
exports.updateAnswer = async (req, res, next) => {
  try {
    let answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(new ErrorResponse('Answer not found', 404));
    }

    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this answer', 401));
    }

    answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name');

    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
exports.deleteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(new ErrorResponse('Answer not found', 404));
    }

    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this answer', 401));
    }

    await answer.deleteOne(); 

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upvote an answer
// @route   PUT /api/answers/:id/upvote
// @access  Private
exports.upvoteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return next(new ErrorResponse('Answer not found', 404));
    }

    // ❌ Kendi cevabına oy verme
    if (answer.author.toString() === req.user.id) {
      return next(new ErrorResponse('Kendi cevabınıza oy veremezsiniz', 403));
    }

    // ✅ Daha önce oy vermiş mi kontrolü
    const existingVote = await Vote.findOne({
      user: req.user.id,
      refType: 'Answer',
      refId: answer._id
    });

    if (existingVote) {
      return next(new ErrorResponse('Bu cevaba zaten oy verdiniz', 400));
    }

    // ✅ Oy kaydı oluştur
    await Vote.create({
      user: req.user.id,
      refType: 'Answer',
      refId: answer._id
    });

    // 🔼 Oy sayısını artır
    answer.upvotes += 1;
    await answer.save();

    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (err) {
    next(err);
  }
};

exports.removeAnswerUpvote = async (req, res, next) => {
    try {
      const vote = await Vote.findOneAndDelete({
        user: req.user.id,
        refType: 'Answer',
        refId: req.params.id
      });
  
      if (!vote) {
        return next(new ErrorResponse('You have not upvoted this answer', 400));
      }
  
      await Answer.findByIdAndUpdate(req.params.id, {
        $inc: { upvotes: -1 }
      });
  
      res.status(200).json({
        success: true,
        message: 'Upvote removed'
      });
    } catch (err) {
      next(err);
    }
  };
  
// @desc    Mark answer as best answer
// @route   PUT /api/questions/:questionId/answers/:id/best
// @access  Private
exports.markBestAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    const answer = await Answer.findById(req.params.id);

    if (!question || !answer) {
      return next(new ErrorResponse('Question or answer not found', 404));
    }

    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to mark best answer', 401));
    }

    // Make sure answer belongs to the question
    if (answer.question.toString() !== question._id.toString()) {
      return next(new ErrorResponse('Answer does not belong to this question', 400));
    }

    // Set best answer
    question.bestAnswer = answer._id;
    await question.save();

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    next(err);
  }
};
