const Gallery = require('../models/Gallery');
const fs = require('fs');

// POST /api/gallery
exports.uploadImage = async (req, res, next) => {
  try {
    const image = new Gallery({
      title: req.body.title,
      imageUrl: `/uploads/gallery/${req.file.filename}`,
    });
    await image.save();
    res.status(201).json({ success: true, image });
  } catch (err) {
    next(err);
  }
};

// GET /api/gallery
exports.getGallery = async (req, res, next) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/gallery/:id
exports.deleteImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const fullPath = `.${image.imageUrl}`;
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    await image.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};
