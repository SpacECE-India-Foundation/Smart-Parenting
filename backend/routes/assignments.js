const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const ChildProfile = require('../models/ChildProfile');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/assignments — Fetch teachers and children (Admin only)
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).sort({ displayName: 1, email: 1 });
    const children = await ChildProfile.find({}).sort({ name: 1 });

    res.json({
      data: {
        teachers: teachers.map(t => t.toPublic()),
        children
      },
      error: null
    });
  } catch (err) {
    res.status(500).json({ data: null, error: err.message });
  }
});

// POST /api/assignments — Assign child to a teacher (Admin only)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { teacherId, childId } = req.body;

    if (!teacherId || !childId) {
      return res.status(400).json({ data: null, error: 'Missing teacherId or childId in request body.' });
    }

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ data: null, error: 'Invalid teacherId or childId format.' });
    }

    // 2. Validate child presence
    const child = await ChildProfile.findById(childId);
    if (!child) {
      return res.status(404).json({ data: null, error: 'Child profile not found.' });
    }

    // 3. Validate teacher presence and role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ data: null, error: 'Teacher not found or user role is not teacher.' });
    }

    // 4. Double assignment check (ensure student is not assigned to another teacher)
    const existingTeacher = await User.findOne({
      role: 'teacher',
      linked_child_profiles: childId,
      _id: { $ne: teacherId }
    });

    if (existingTeacher) {
      return res.status(400).json({
        data: null,
        error: `This student is already assigned to teacher: ${existingTeacher.displayName || existingTeacher.email}.`
      });
    }

    // 5. Atomic check & update
    await User.findByIdAndUpdate(teacherId, { $addToSet: { linked_child_profiles: childId } });

    res.json({ data: { success: true }, error: null });
  } catch (err) {
    res.status(500).json({ data: null, error: err.message });
  }
});

// DELETE /api/assignments/:teacherId/:childId — Unassign child from a teacher (Admin only)
router.delete('/:teacherId/:childId', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { teacherId, childId } = req.params;

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ data: null, error: 'Invalid teacherId or childId format.' });
    }

    // 2. Validate child presence
    const child = await ChildProfile.findById(childId);
    if (!child) {
      return res.status(404).json({ data: null, error: 'Child profile not found.' });
    }

    // 3. Validate teacher presence and role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ data: null, error: 'Teacher not found or user role is not teacher.' });
    }

    // 4. Update teacher assignments (remove childId)
    await User.findByIdAndUpdate(teacherId, { $pull: { linked_child_profiles: childId } });

    res.json({ data: { success: true }, error: null });
  } catch (err) {
    res.status(500).json({ data: null, error: err.message });
  }
});

module.exports = router;
