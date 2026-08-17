/**
 * routes/milestones.js
 * Handle milestone assessments and activity recommendations.
 */

const router = require('express').Router();
const MilestoneAssessment = require('../models/MilestoneAssessment');
const Recommendation = require('../models/Recommendation');
const { verifyToken, requireRole } = require('../middleware/auth');
const { allocateForChild } = require('../services/activityAllocationService');
const Activity = require('../models/Activity');

// ── Milestone Assessments ───────────────────────────────────────────────────

// POST — save milestone assessment result
router.post('/assessments', verifyToken, async (req, res) => {
  try {
    const assessment = await MilestoneAssessment.create(req.body);

    // Auto-allocate activities based on the freshly computed domainScores.
    // Wrapped so a failure here never blocks the assessment save itself.
    let recommendations = [];
    try {
      recommendations = await allocateForChild(assessment.childId);
    } catch (allocErr) {
      console.error('Auto-allocation failed:', allocErr.message);
    }

    res.status(201).json({ data: assessment, recommendations, error: null });
  } catch (err) {
    res.status(400).json({ data: null, error: err.message });
  }
});

// GET — get latest assessment for a child
router.get('/assessments/latest', verifyToken, async (req, res) => {
  try {
    const { childId } = req.query;
    if (!childId) return res.status(400).json({ error: 'childId is required' });
    const assessment = await MilestoneAssessment.findOne({ childId }).sort({ completedAt: -1 });
    res.json({ data: assessment, error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — get all assessments (optional childId filter)
router.get('/assessments', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.childId) filter.childId = req.query.childId;
    const assessments = await MilestoneAssessment.find(filter).sort({ completedAt: -1 });
    res.json({ data: assessments, error: null });
  } catch (err) {
    res.status(500).json({ data: [], error: err.message });
  }
});

// DELETE — delete milestone assessment (admin only)
router.delete('/assessments/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const doc = await MilestoneAssessment.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Milestone assessment not found.' });
    res.json({ message: 'Milestone assessment deleted successfully.', error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ── Recommendations ─────────────────────────────────────────────────────────

// POST — create a recommendation (admin / teacher only)
router.post('/recommendations', verifyToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const rec = await Recommendation.create(req.body);
    res.status(201).json({ data: rec, error: null });
  } catch (err) {
    res.status(400).json({ data: null, error: err.message });
  }
});

// GET — list recommendations for a child
router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    const { childId } = req.query;
    if (!childId) return res.status(400).json({ error: 'childId is required' });
    const recs = await Recommendation.find({ child_id: childId }).sort({ created_at: -1 });
    res.json({ data: recs, error: null });
  } catch (err) {
    res.status(500).json({ data: [], error: err.message });
  }
});

// PUT — update completion status of a recommendation
router.put('/recommendations/:id', verifyToken, async (req, res) => {
  try {
    const { completed } = req.body;
    const rec = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true, runValidators: true }
    );
    if (!rec) return res.status(404).json({ data: null, error: 'Recommendation not found.' });
    res.json({ data: rec, error: null });
  } catch (err) {
    res.status(400).json({ data: null, error: err.message });
  }
});

router.post('/recommendations/auto-allocate', verifyToken, async (req, res) => {
  try {
    const { childId, count } = req.body;
    if (!childId) return res.status(400).json({ data: null, error: 'childId is required' });

    const recommendations = await allocateForChild(childId, count || 8);
    res.status(201).json({ data: recommendations, error: null });
  } catch (err) {
    res.status(400).json({ data: null, error: err.message });
  }
});

router.get('/activities-by-ids', verifyToken, async (req, res) => {
  try {
    const { ids } = req.query; // comma-separated string of Activity _ids
    if (!ids) return res.status(400).json({ data: [], error: 'ids is required' });

    const idList = ids.split(',').filter(Boolean);
    const activities = await Activity.find({ _id: { $in: idList } });
    res.json({ data: activities, error: null });
  } catch (err) {
    res.status(500).json({ data: [], error: err.message });
  }
});

module.exports = router;
