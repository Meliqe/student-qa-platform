const express = require('express');
const {
  getQuestions,
  getQuestion,
  getQuestionBySlug,
  createQuestion,
  deleteQuestion,
  getTags,
  searchQuestions,
  getQuestionsByTag
} = require('../controllers/questions');
const { csrfProtection, cookieMiddleware } = require('../middleware/csrf');
const { protect, authorize } = require('../middleware/auth');
const { questionValidation } = require('../middleware/validators');
// Include other resource routers
const answerRouter = require('./answers');

const router = express.Router();

// Re-route into other resource routers
router.use('/:questionId/answers', answerRouter);

// Get all tags
router.get('/tags', getTags);
router.get('/by-tag', getQuestionsByTag)

// Search questions
router.get('/search', searchQuestions);

// Get question by slug
router.get('/slug/:slug', getQuestionBySlug);

router
  .route('/')
  .get(getQuestions)
  .post(/*cookieMiddleware,csrfProtection,protect*/protect,questionValidation, createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .delete(/*cookieMiddleware,csrfProtection,protect*/protect, deleteQuestion);

module.exports = router;
