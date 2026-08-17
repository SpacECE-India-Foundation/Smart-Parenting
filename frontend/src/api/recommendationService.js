/**
 * recommendationService.js
 *
 * Fetches the latest milestone assessment AND the auto-allocated activity
 * recommendations (generated server-side by activityAllocationService.js
 * whenever an assessment is submitted) for a given child.
 *
 * Falls back to the static client-side catalogue ONLY if the child has an
 * assessment but no DB recommendations yet (e.g. old assessment taken
 * before the allocation engine was wired in) — so nothing breaks mid-rollout.
 */
import client from '../api/client';
import { generateRecommendations, DOMAIN_META } from '../data/activityRecommendations';

/**
 * @param {string} childId
 * @returns {Promise<{
 *   assessmentData: object,
 *   recommendations: object[],   — enriched activity list, ready for ActivityRecommendationCard
 *   domainScores: object,
 * } | null>}
 */
export async function getChildRecommendations(childId) {
  if (!childId) return null;

  try {
    const { data } = await client.get('/milestones/assessments/latest', { params: { childId } });
    if (!data.data) return null; // no assessment yet — panel stays hidden

    const docData = data.data;
    const domainScores = docData.domainScores ?? {};

    // 1. Try the real, DB-backed recommendations (auto-allocated from the curriculum bank)
    const { data: recData } = await client.get('/milestones/recommendations', { params: { childId } });
    const dbRecs = (recData?.data ?? []).filter((r) => !r.completed);

    if (dbRecs.length > 0) {
      const enriched = await enrichFromDb(dbRecs, domainScores);
      return { assessmentData: docData, recommendations: enriched, domainScores };
    }

    // 2. Fallback: static catalogue (covers children whose assessment predates
    //    the allocation engine, or if allocation temporarily produced nothing)
    return {
      assessmentData: docData,
      recommendations: generateRecommendations(domainScores, 4),
      domainScores,
    };
  } catch (e) {
    console.error('[recommendationService] getChildRecommendations error:', e);
    return null;
  }
}

/**
 * Merges Recommendation docs (activity_id, activity_name, domain, priority, reason)
 * with full Activity details (description, milestone) fetched in one batch call,
 * and attaches domain visuals (emoji/color) from DOMAIN_META for card styling.
 */
async function enrichFromDb(dbRecs, domainScores) {
  const ids = dbRecs.map((r) => r.activity_id).filter(Boolean).join(',');
  let activityDetails = {};

  if (ids) {
    try {
      const { data } = await client.get('/milestones/activities-by-ids', { params: { ids } });
      for (const a of data?.data ?? []) {
        activityDetails[a._id] = a;
      }
    } catch (e) {
      console.error('[recommendationService] activities-by-ids error:', e);
      // continue without descriptions rather than failing the whole panel
    }
  }

  return dbRecs.map((rec) => {
    const detail = activityDetails[rec.activity_id];
    const meta = DOMAIN_META[rec.domain];
    return {
      id: rec._id,
      title: rec.activity_name,
      description: detail?.description ?? rec.reason ?? '',
      domain: rec.domain,
      domainMeta: meta,
      domainPercentage: Math.round(domainScores?.[rec.domain]?.percentage ?? 0),
      emoji: meta?.emoji ?? '✨',
      // priority carried through in case the UI wants to surface it later
      priority: rec.priority,
    };
  });
}
