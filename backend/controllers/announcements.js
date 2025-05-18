const Announcement = require('../models/Announcement');
const fs = require('fs');
const path = require('path');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate({
        path: 'createdBy',
        select: 'name'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate({
        path: 'createdBy',
        select: 'name'
      });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id

    if (req.file) {
      req.body.imageUrl = `/uploads/announcements/${req.file.filename}`
    }

    const announcement = await Announcement.create(req.body)

    res.status(201).json({
      success: true,
      data: announcement
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id)
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }

    if (req.file) {
      req.body.imageUrl = `/uploads/announcements/${req.file.filename}`
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: announcement
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Eğer resim varsa sil
    if (announcement.imageUrl) {
      const filePath = path.join(__dirname, '..', announcement.imageUrl)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Resim silinemedi:', err.message)
        }
      })
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

