const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// @route POST /api/applications — Apply karo
router.post('/', protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: jobId, worker: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const application = await Application.create({
      job: jobId,
      jobTitle: job.title,
      worker: req.user._id,
      owner: job.owner,
      workerSnapshot: {
        name: req.user.name,
        phone: req.user.phone,
        skills: req.user.skills
      }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/applications/worker — Worker ki apni applications
router.get('/worker', protect, async (req, res) => {
  try {
    const applications = await Application.find({ worker: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/applications/owner — Owner ko aayi applications
router.get('/owner', protect, async (req, res) => {
  try {
    const applications = await Application.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/applications/:id/status — Status update
router.put('/:id/status', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    application.status = req.body.status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;