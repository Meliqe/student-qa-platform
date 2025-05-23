const express = require('express');
const { uploadImage, getGallery, deleteImage } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploadGallery');

const router = express.Router();

router
  .route('/')
  .get(getGallery)
  .post(protect, authorize('admin'), upload.single('image'), uploadImage);

router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteImage);

module.exports = router;
