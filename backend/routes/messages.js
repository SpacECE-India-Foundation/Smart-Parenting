/**
 * routes/messages.js
 *
 * Express routes for Parent-Teacher messaging associated with a specific child.
 */

const router = require('express').Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const ChildProfile = require('../models/ChildProfile');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || (file.fieldname === 'audio' ? '.webm' : '');
    const prefix = file.fieldname === 'audio' ? 'chat-audio-' : 'chat-img-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.webm', '.ogg', '.mp3', '.wav', '.m4a'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('File format not allowed.'), false);
  }
  
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'audio/webm', 'audio/ogg', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm;codecs=opus'
  ];
  
  const mimeTypeBase = file.mimetype.split(';')[0];
  if (!allowedMimeTypes.includes(file.mimetype) && !allowedMimeTypes.includes(mimeTypeBase)) {
    return cb(new Error('Invalid file type.'), false);
  }
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to validate ObjectId and check parent/teacher access permissions
const checkMessageAccess = async (req, res, next) => {
  try {
    const { childId } = req.params;

    // 1. ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ error: 'Invalid child ID format.' });
    }

    // 2. Presence check
    const child = await ChildProfile.findById(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child profile not found.' });
    }

    const { userId, role } = req.user;

    // 3. Security check: Must be assigned parent or teacher
    if (role === 'parent') {
      if (child.parent_uid.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied: You are not the assigned parent for this child.' });
      }
      req.childProfile = child;
      return next();
    }

    if (role === 'teacher') {
      const teacher = await User.findById(userId);
      if (!teacher || !teacher.linked_child_profiles.includes(childId)) {
        return res.status(403).json({ error: 'Access denied: You are not the assigned teacher for this child.' });
      }
      req.childProfile = child;
      return next();
    }

    return res.status(403).json({ error: 'Access denied: Insufficient permissions for this resource.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/messages/:childId - Fetch all messages for a specific child, oldest to newest (excluding deleted-for-me ones)
router.get('/:childId', verifyToken, checkMessageAccess, async (req, res) => {
  try {
    const { userId } = req.user;
    const messages = await Message.find({
      childId: req.params.childId,
      deletedFor: { $ne: userId }
    })
      .populate('senderId', 'displayName')
      .sort({ createdAt: 1 });

    const sanitizedMessages = messages.map(msg => {
      const plainMsg = msg.toObject();
      if (plainMsg.deletedForEveryone) {
        return {
          _id: plainMsg._id,
          childId: plainMsg.childId,
          senderId: plainMsg.senderId,
          senderRole: plainMsg.senderRole,
          createdAt: plainMsg.createdAt,
          deletedForEveryone: true
        };
      }
      return plainMsg;
    });

    res.json({ data: sanitizedMessages, error: null });
  } catch (err) {
    res.status(500).json({ data: [], error: err.message });
  }
});

// POST /api/messages/:childId - Send a text, image, or voice message tied to a specific child
router.post('/:childId', verifyToken, checkMessageAccess, (req, res, next) => {
  const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]);

  uploadFields(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size limit exceeded. Max limit is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { text } = req.body;
    const files = req.files || {};
    const imageFile = files.image ? files.image[0] : null;
    const audioFile = files.audio ? files.audio[0] : null;

    // Validate presence: must have text, image, or audio
    const hasText = text && typeof text === 'string' && text.trim();
    const hasImage = !!imageFile;
    const hasAudio = !!audioFile;

    if (!hasText && !hasImage && !hasAudio) {
      return res.status(400).json({ error: 'Message must contain text, an image, or a voice note.' });
    }

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;
    const audioUrl = audioFile ? `/uploads/${audioFile.filename}` : undefined;

    const newMessage = await Message.create({
      childId: req.params.childId,
      senderId: req.user.userId,
      senderRole: req.user.role,
      text: hasText ? text.trim() : undefined,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
    });

    res.status(201).json({ data: newMessage, error: null });
  } catch (err) {
    res.status(400).json({ data: null, error: err.message });
  }
});

// Middleware to check access for deleting a specific message
const checkMessageDeleteAccess = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID format.' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    const child = await ChildProfile.findById(message.childId);
    if (!child) {
      return res.status(404).json({ error: 'Associated child profile not found.' });
    }

    const { userId, role } = req.user;

    if (role === 'parent') {
      if (child.parent_uid.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied: You are not the assigned parent for this child.' });
      }
    } else if (role === 'teacher') {
      const teacher = await User.findById(userId);
      if (!teacher || !teacher.linked_child_profiles.includes(child.id)) {
        return res.status(403).json({ error: 'Access denied: You are not the assigned teacher for this child.' });
      }
    } else {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions.' });
    }

    req.chatMessage = message;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PATCH /api/messages/:messageId/delete - Delete a message for one user or everyone
router.patch('/:messageId/delete', verifyToken, checkMessageDeleteAccess, async (req, res) => {
  try {
    const { mode } = req.body;
    const message = req.chatMessage;
    const { userId } = req.user;

    if (mode === 'me') {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
      return res.json({ success: true, data: message });
    }

    if (mode === 'everyone') {
      // Only the sender can delete for everyone
      if (message.senderId.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied: Only the sender can delete for everyone.' });
      }

      message.deletedForEveryone = true;
      message.text = undefined;
      message.imageUrl = undefined;
      message.audioUrl = undefined;
      await message.save();

      return res.json({ success: true, data: message });
    }

    return res.status(400).json({ error: 'Invalid delete mode. Must be "me" or "everyone".' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
