const express = require('express');
const router = express.Router();
const Center = require('../models/Center');

// @route   POST /api/centers/register
// @desc    Register a new Anganwadi / Preschool / NGO center
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { centerName, centerType, location, contactPerson, phone, expectedChildren } = req.body;

    if (!centerName || !contactPerson || !phone) {
      return res.status(400).json({ error: 'Center Name, Contact Person, and Phone are required.' });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Duplicate check in database
    const existing = await Center.findOne({
      $or: [{ phone: cleanPhone }, { centerName: new RegExp(`^${centerName.trim()}$`, 'i') }]
    });

    if (existing) {
      return res.status(400).json({ error: 'This phone number or center name has already been registered.' });
    }

    const newCenter = new Center({
      centerName: centerName.trim(),
      centerType: centerType || 'anganwadi',
      location: (location || '').trim(),
      contactPerson: contactPerson.trim(),
      phone: cleanPhone,
      expectedChildren: expectedChildren || '25-50',
    });

    await newCenter.save();

    res.status(201).json({
      message: 'Center registration submitted successfully.',
      center: newCenter,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/centers
// @desc    Get all registered centers
// @access  Public / Admin
router.get('/', async (req, res, next) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    res.json({ centers });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/centers/:id/status
// @desc    Update center status (pending, contacted, approved)
// @access  Admin
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'contacted', 'approved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const center = await Center.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!center) {
      return res.status(404).json({ error: 'Center not found.' });
    }

    res.json({ message: 'Center status updated successfully.', center });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/centers/:id
// @desc    Delete a center registration record
// @access  Admin
router.delete('/:id', async (req, res, next) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);
    if (!center) {
      return res.status(404).json({ error: 'Center not found.' });
    }
    res.json({ message: 'Center deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
