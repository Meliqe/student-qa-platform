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
    select: "name _id", 
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

    await question.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
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

    // 🔧 Normalize: boşlukları ve noktalama işaretlerini kaldır, küçük harfe çevir
    const normalizedKeyword = keyword.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    const questions = await Question.find().populate('author', 'name').sort('-createdAt');

    // 🔍 İçerik ve başlıkta normalize edilmiş şekilde eşleşme ara
    const filtered = questions.filter((q) => {
      const normTitle = q.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const normContent = q.content.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return normTitle.includes(normalizedKeyword) || normContent.includes(normalizedKeyword);
    });

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
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

// @desc    Get questions by tag
// @route   GET /api/questions/by-tag?tag=javascript
// @access  Public
exports.getQuestionsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;

    if (!tag) {
      return next(new ErrorResponse("Please provide a tag name", 400));
    }

    const questions = await Question.find({ tags: tag })
      .populate({ path: 'author', select: 'name' })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    next(err);
  }
};
