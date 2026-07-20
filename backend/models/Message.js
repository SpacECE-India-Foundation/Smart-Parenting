/**
 * models/Message.js
 *
 * Defines the schema for Parent-Teacher chat messages.
 */

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChildProfile',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['parent', 'teacher'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    deletedFor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    deletedForEveryone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

// Validate that at least one of text, imageUrl, or audioUrl is present (unless deleted for everyone)
MessageSchema.pre('validate', function (next) {
  if (!this.deletedForEveryone && !this.text && !this.imageUrl && !this.audioUrl) {
    this.invalidate('text', 'Message must contain text, an image, or an audio note.');
  }
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
