const UserSession = require('../models/UserSession');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get site statistics
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    // Get total questions
    const totalQuestions = await Question.countDocuments();
    
    // Get total answers
    const totalAnswers = await Answer.countDocuments();
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get online users (active in the last 15 minutes)
    const onlineUsers = await UserSession.countDocuments({ isOnline: true });
    
    // Get most viewed questions
    const popularQuestions = await Question.find()
      .sort('-viewCount')
      .limit(5)
      .populate({
        path: 'author',
        select: 'name'
      });
    
    // Get most recent questions
    const recentQuestions = await Question.find()
      .sort('-createdAt')
      .limit(5)
      .populate({
        path: 'author',
        select: 'name'
      });
    
    res.status(200).json({
      success: true,
      data: {
        totalQuestions,
        totalAnswers,
        totalUsers,
        onlineUsers,
        popularQuestions,
        recentQuestions
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user session (mark as online)
// @route   PUT /api/stats/session
// @access  Private
exports.updateSession = async (req, res, next) => {
  try {
    // Find existing session
    let session = await UserSession.findOne({ user: req.user.id });
    
    if (session) {
      // Update last active time
      session.lastActive = Date.now();
      session.isOnline = true;
      await session.save();
    } else {
      // Create new session
      session = await UserSession.create({
        user: req.user.id,
        lastActive: Date.now(),
        isOnline: true
      });
    }
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    next(err);
  }
};

// @desc    End user session (mark as offline)
// @route   PUT /api/stats/session/end
// @access  Private
exports.endSession = async (req, res, next) => {
  try {
    // Find existing session
    const session = await UserSession.findOne({ user: req.user.id });
    
    if (session) {
      // Mark as offline
      session.isOnline = false;
      await session.save();
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
