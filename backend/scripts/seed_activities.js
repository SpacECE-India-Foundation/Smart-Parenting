/**
 * scripts/seed_activities.js
 * Loads the curriculum-derived activity bank (data/activity_seed_data.json,
 * ~12.9k documents extracted from the Annual Curriculum Plan PDFs) into the
 * Activity collection.
 *
 * Usage:
 *   node scripts/seed_activities.js          (adds/updates, keeps existing)
 *   node scripts/seed_activities.js --reset  (wipes Activity collection first)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity');

const MONGODB_URI = process.env.MONGODB_URI;
const RESET = process.argv.includes('--reset');

async function seedActivities() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  if (RESET) {
    const { deletedCount } = await Activity.deleteMany({});
    console.log(`Cleared ${deletedCount} existing activities`);
  }

  const dataPath = path.join(__dirname, '../data/activity_seed_data.json');
  const records = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Loaded ${records.length} activity records from file`);

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  // bulkWrite in batches — upsert on (domain, level, milestone_no, variant)
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

    try {
      const result = await Activity.bulkWrite(ops, { ordered: false });
      inserted += result.upsertedCount || 0;
      updated += result.modifiedCount || 0;
    } catch (err) {
      failed += batch.length;
      console.error(`Batch ${i}-${i + batch.length} failed:`, err.message);
    }
    process.stdout.write(`\rProcessed ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`);
  }

  console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}, Failed: ${failed}`);

  const total = await Activity.countDocuments();
  console.log(`Total activities now in DB: ${total}`);

  await mongoose.disconnect();
}

seedActivities().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
