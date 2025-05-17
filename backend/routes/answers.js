const express = require('express');
const {
  getAnswers,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  upvoteAnswer,
  markBestAnswer,
  removeAnswerUpvote
} = require('../controllers/answers');

const { protect, authorize } = require('../middleware/auth');
const { answerValidation } = require('../middleware/validators');
const { csrfProtection, cookieMiddleware } = require('../middleware/csrf');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAnswers)
  .post(/*cookieMiddleware,csrfProtection,protect*/protect, answerValidation, addAnswer);

router
  .route('/:id')
  .put(/*cookieMiddleware,csrfProtection,protect*/protect, answerValidation, updateAnswer)
  .delete(/*cookieMiddleware,csrfProtection,protect*/protect, deleteAnswer);

router.put('/:id/upvote',/*cookieMiddleware,csrfProtection,protect*/ protect, upvoteAnswer);
router.put('/:id/best', /*cookieMiddleware,csrfProtection,protect*/ markBestAnswer);

router.delete('/:id/remove-upvote',/*cookieMiddleware,csrfProtection,protect*/ protect, removeAnswerUpvote);

module.exports = router;
