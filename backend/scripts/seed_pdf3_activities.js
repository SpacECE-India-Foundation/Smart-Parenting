/**
 * scripts/seed_pdf3_activities.js
 * Loads PDF 3 activities (Level 13-18, 6-9 years, ~6535 documents) into
 * the Activity collection. Separate from seed_activities.js so PDF 1+2
 * data (12,903 docs) is never touched by this run.
 *
 * Usage: node scripts/seed_pdf3_activities.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const dataPath = path.join(__dirname, '../data/pdf3_seed_data.json');
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Loaded ${records.length} PDF 3 activity records`);

  let upserted = 0;
  let modified = 0;
  const BATCH_SIZE = 1000;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const ops = batch.map((r) => ({
      updateOne: {
        filter: { domain: r.domain, level: r.level, milestone_no: r.milestone_no, variant: r.variant },
        update: { $set: r },
        upsert: true,
      },
    }));
    const result = await Activity.bulkWrite(ops, { ordered: false });
    upserted += result.upsertedCount || 0;
    modified += result.modifiedCount || 0;
    process.stdout.write(`\rProcessed ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`);
  }

  console.log(`\nDone. Upserted: ${upserted}, Modified: ${modified}`);
  const total = await Activity.countDocuments();
  console.log(`Total activities now in DB: ${total}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
