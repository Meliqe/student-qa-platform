const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const UserSession = require('../models/UserSession');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user profile by username
// @route   GET /api/users/profile/:username
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's questions
    const questions = await Question.find({ author: user._id })
      .sort('-createdAt');

    // Get user's answers
    const answers = await Answer.find({ author: user._id })
      .populate('question', 'title slug')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        user,
        questions,
        answers
      }
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserQuestions = async (req, res, next) => {
  try {
    const userId = req.user.id; // Token'dan gelen kullanıcı ID

    const questions = await Question.find({ author: userId }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    next(err)
  }
}

exports.getUserAnswers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const answers = await Answer.find({ author: userId })
      .populate('question', 'title slug')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });
  } catch (err) {
    next(err)
  }
}


// @desc    Get all currently online users
// @route   GET /api/users/online
// @access  Private/Admin
exports.getOnlineUsers = async (req, res, next) => {
  try {
    const sessions = await UserSession.find({ isOnline: true }).populate('user', 'name email');

    const onlineUsers = sessions.map(session => session.user);

    res.status(200).json({
      success: true,
      count: onlineUsers.length,
      data: onlineUsers
    });
  } catch (err) {
    next(err);
  }
};




