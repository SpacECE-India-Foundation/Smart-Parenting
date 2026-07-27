const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  centerName: {
    type: String,
    required: true,
    trim: true,
  },
  centerType: {
    type: String,
    enum: ['anganwadi', 'preschool', 'ngo'],
    default: 'anganwadi',
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  expectedChildren: {
    type: String,
    default: '25-50',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'contacted'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Center', centerSchema);
