/**
 * models/Activity.js
 * Curriculum activity bank — sourced from the Annual Curriculum Plan
 * (Level 1–12, 0–6 years). Powers the automatic activity allocation
 * engine: given a child's domain progress, the engine queries this
 * collection for the weakest domain(s) at the child's level and
 * generates Recommendation documents automatically.
 */

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      enum: [
        'Physical Development',
        'Cognitive Development',
        'Social Development',
        'Emotional Development',
        'Aesthetic Development',
      ],
    },
    level:        { type: Number, required: true, min: 1, max: 18 }, // curriculum level
    age_group:    { type: String, required: true },                  // e.g. "0 to 6 Months"
    milestone_no: { type: Number, required: true },
    milestone:    { type: String, required: true, trim: true },
    variant:      { type: Number, required: true, min: 1, max: 5 },  // Activity 1..5 for this milestone
    title:        { type: String, required: true, trim: true },      // short display title
    description:  { type: String, required: true, trim: true },      // full activity instruction text
    source:       { type: String, default: 'curriculum_plan' },      // pdf1 / pdf2 / manual
    is_active:    { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// One milestone+variant combination should be unique per domain/level
ActivitySchema.index({ domain: 1, level: 1, milestone_no: 1, variant: 1 }, { unique: true });
// Fast lookup for the allocation engine: "give me activities for this domain at this level"
ActivitySchema.index({ domain: 1, level: 1, is_active: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
