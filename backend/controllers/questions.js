const Question = require("../models/Question");
const User = require("../models/User");
const Vote = require("../models/Vote");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["sort", "page", "limit", "tag"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    query = Question.find(JSON.parse(queryStr)).populate({
      path: "author",
      select: "name",
    });

    // Filter by tag if provided
    if (req.query.tag) {
      query = query.find({ tags: req.query.tag });
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Question.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const questions = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate({
        path: "author",
        select: "name",
      })
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "name",
        },
      });

    if (!question) {
      return next(new ErrorResponse("Question not found", 404));
    }

    // Increment view count
    question.viewCount += 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get question by slug
// @route   GET /api/questions/slug/:slug
// @access  Public
exports.getQuestionBySlug = async (req, res, next) => {
  try {
    const question = await Question.findOne({ slug: req.params.slug })
      .populate({
        path: "author",
        select: "name",
      })
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "name",
        },
      });

    if (!question) {
      return next(new ErrorResponse("Question not found", 404));
    }

    // Increment view count
    question.viewCount += 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse("Question not found", 404));
    }

    // Make sure user is question owner
    if (
      question.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse("Not authorized to update this question", 401)
      );
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse("Question not found", 404));
    }

    // Make sure user is question owner
    if (
      question.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse("Not authorized to delete this question", 401)
      );
    }

    await question.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upvote a question
// @route   PUT /api/questions/:id/upvote
// @access  Private
exports.upvoteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse("Question not found", 404));
    }

    // Check if user has already upvoted this question
    const existingVote = await Vote.findOne({
      user: req.user.id,
      refType: "Question",
      refId: question._id,
    });

    if (existingVote) {
      return next(
        new ErrorResponse("You have already upvoted this question", 400)
      );
    }

    // Create vote record
    await Vote.create({
      user: req.user.id,
      refType: "Question",
      refId: question._id,
    });

    // Increment upvotes
    question.upvotes += 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search questions
// @route   GET /api/questions/search
// @access  Public
exports.searchQuestions = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return next(new ErrorResponse("Please provide a search keyword", 400));
    }

    // Search in title and content
    const questions = await Question.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate({
        path: "author",
        select: "name",
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tags
// @route   GET /api/questions/tags
// @access  Public
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Question.distinct("tags");

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (err) {
    next(err);
  }
};
