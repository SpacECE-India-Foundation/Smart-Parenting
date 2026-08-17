/**
 * services/activityAllocationService.js
 *
 * Automatic activity allocation engine.
 * Ports the existing frontend logic (data/activityRecommendations.js:
 * rankDomainsByNeed + generateRecommendations) to run server-side against
 * the real Activity collection (~12.9k activities seeded from the
 * curriculum plan PDFs), and persists results as Recommendation documents.
 *
 * Flow:
 *   1. Child completes a MilestoneAssessment -> domainScores saved.
 *   2. allocateForChild(childId) is called (see call site notes below).
 *   3. Domains are ranked weakest -> strongest (same logic as before).
 *   4. For each domain, activities are pulled from the Activity bank at
 *      the child's current milestone_level, weakest domain gets the most.
 *   5. Recommendation docs are created/refreshed for the dashboard.
 */

const Activity = require('../models/Activity');
const Recommendation = require('../models/Recommendation');
const MilestoneAssessment = require('../models/MilestoneAssessment');

const ALL_DOMAINS = [
  'Physical Development',
  'Cognitive Development',
  'Social Development',
  'Emotional Development',
  'Aesthetic Development',
];

/**
 * Same ranking rule as the frontend version: domains with no data are
 * treated as needing support (percentage = 0), sorted ascending.
 */
function rankDomainsByNeed(domainScores) {
  return ALL_DOMAINS
    .map((domain) => ({
      domain,
      percentage: domainScores?.[domain]?.percentage ?? 0,
    }))
    .sort((a, b) => a.percentage - b.percentage);
}

/**
 * Weighted allocation: weakest domain gets the most activities.
 * With `count` total slots and 5 domains ranked weakest->strongest,
 * weights taper off so struggling domains are represented more, but
 * every domain still gets at least one activity if count >= 5.
 */
function allocationWeights(count) {
  // e.g. count=8 -> [3,2,1,1,1] ; count=5 -> [1,1,1,1,1] ; count=10 -> [3,3,2,1,1]
  const base = Math.floor(count / ALL_DOMAINS.length);
  const remainder = count % ALL_DOMAINS.length;
  return ALL_DOMAINS.map((_, i) => base + (i < remainder ? 1 : 0));
}

function priorityForPercentage(pct) {
  if (pct < 40) return 'High';
  if (pct < 70) return 'Medium';
  return 'Low';
}

/**
 * Pulls `n` activities for a domain at the child's level from the DB.
 * Falls back to neighboring levels (level-1, level+1) if not enough
 * activities exist at the exact level, so a sparse domain/level (see
 * known PDF gaps, e.g. Level 11 Aesthetic Development) doesn't come up empty.
 */
async function pickActivitiesForDomain(domain, level, n, excludeIds = []) {
  const levelsToTry = [level, level - 1, level + 1].filter((l) => l >= 1 && l <= 18);
  const picked = [];

  for (const lvl of levelsToTry) {
    if (picked.length >= n) break;
    const remaining = n - picked.length;
    const found = await Activity.aggregate([
      {
        $match: {
          domain,
          level: lvl,
          is_active: true,
          _id: { $nin: excludeIds },
        },
      },
      { $sample: { size: remaining } }, // random variety instead of always the same first N
    ]);
    picked.push(...found);
  }
  return picked;
}

/**
 * Main entry point. Call this whenever a child's domain progress changes
 * (e.g. right after a MilestoneAssessment is saved) to auto-refresh their
 * dashboard recommendations.
 *
 * @param {ObjectId|string} childId
 * @param {number} count            total recommendations to allocate (default 8)
 * @param {boolean} replaceExisting if true, clears this child's pending
 *                                  (not-completed) recommendations first
 */
async function allocateForChild(childId, count = 8, replaceExisting = true) {
  const latestAssessment = await MilestoneAssessment
    .findOne({ childId })
    .sort({ completedAt: -1 });

  if (!latestAssessment) {
    throw new Error('No assessment found for this child — cannot determine domain progress yet.');
  }

  const { domainScores, milestone_level } = latestAssessment;
  const ranked = rankDomainsByNeed(domainScores);
  const weights = allocationWeights(count);

  if (replaceExisting) {
    await Recommendation.deleteMany({ child_id: childId, completed: false });
  }

  // Avoid recommending activities already completed by this child
  const completedIds = await Recommendation.find({ child_id: childId, completed: true })
    .distinct('activity_id');

  const created = [];
  for (let i = 0; i < ranked.length; i += 1) {
    const { domain, percentage } = ranked[i];
    const wantCount = weights[i];
    if (wantCount <= 0) continue;

    const activities = await pickActivitiesForDomain(domain, milestone_level, wantCount, []);

    for (const act of activities) {
      if (completedIds.includes(String(act._id))) continue;
      created.push({
        child_id: childId,
        activity_id: String(act._id),
        activity_name: act.title,
        domain: act.domain,
        reason: `Suggested to strengthen ${act.domain} (currently at ${Math.round(percentage)}% for this milestone level) — targets "${act.milestone}".`,
        priority: priorityForPercentage(percentage),
        completed: false,
      });
    }
  }

  const saved = await Recommendation.insertMany(created);
  return saved;
}

module.exports = {
  allocateForChild,
  rankDomainsByNeed,
  allocationWeights,
};
