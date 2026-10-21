const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/jobs — Saare open jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/jobs/my — Owner ke apne jobs
router.get('/my', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/jobs/:id — Single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/jobs — Naya job create
router.post('/', protect, async (req, res) => {
  try {
    const owner = await User.findById(req.user._id);
    const job = await Job.create({
      ...req.body,
      owner: req.user._id,
      businessName: owner.businessName || 'Local Business'
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/jobs/:id — Job update
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;