/**
 * scripts/patch_review_activities.js
 *
 * Fixes the 12 milestones that had incomplete/garbled activity text
 * (cut off by a page-break in the source PDF). Upserts only these
 * 60 activity documents (12 milestones × 5 variants) — the other
 * 12,843 activities already in the DB are untouched.
 *
 * Usage: node scripts/patch_review_activities.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity');

const MONGODB_URI = process.env.MONGODB_URI;

async function patchActivities() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const dataPath = path.join(__dirname, '../data/review_rows_seed_patch.json');
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Patching ${records.length} activity documents (12 milestones)`);

  const ops = records.map((r) => ({
    updateOne: {
      filter: { domain: r.domain, level: r.level, milestone_no: r.milestone_no, variant: r.variant },
      update: { $set: r },
      upsert: true,
    },
  }));

  const result = await Activity.bulkWrite(ops, { ordered: false });
  console.log(`Done. Upserted: ${result.upsertedCount || 0}, Modified: ${result.modifiedCount || 0}`);

  await mongoose.disconnect();
}

patchActivities().catch((err) => {
  console.error('Patch failed:', err);
  process.exit(1);
});
