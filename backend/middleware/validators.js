const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }
  next();
};

// User registration validation rules
const registerValidation = [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please add a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

// User login validation rules
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please add a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required'),
  validate
];

// Question validation rules
const questionValidation = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('content')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content is required'),
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Please add between 1 and 5 tags'),
  validate
];

// Answer validation rules
const answerValidation = [
  body('content')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content is required'),
  validate
];

// Announcement validation rules
const announcementValidation = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('content')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Content is required'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  questionValidation,
  answerValidation,
  announcementValidation
};
