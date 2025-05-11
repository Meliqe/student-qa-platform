const VisitCounter = require('../models/VisitCounter');

// @desc    Ziyaretçi sayacını artır
// @route   POST /api/visit
// @access  Public
exports.incrementVisit = async (req, res) => {
  try {
    const counter = await VisitCounter.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, total: counter.count });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Sayaç artırılamadı' });
  }
};

// @desc    Ziyaretçi sayısını getir
// @route   GET /api/visit
// @access  Private/Admin
exports.getVisitCount = async (req, res) => {
  try {
    const counter = await VisitCounter.findOne({});
    res.status(200).json({ success: true, total: counter?.count || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Sayaç okunamadı' });
  }
};
