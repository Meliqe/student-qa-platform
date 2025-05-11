const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @desc    Get basic site statistics
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalAnswers
      }
    });
  } catch (err) {
    next(err);
  }
};
