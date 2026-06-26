/**
 * recommendationService.js
 *
 * Fetches the latest milestone assessment result for a given child from
 * Firestore and returns enriched activity recommendations.
 *
 * Collection read: milestone_assessments
 *   Query: childId == uid, orderBy completedAt desc, limit 1
 *
 * This module is intentionally Firestore-only — no auth, no context.
 * The caller (RecommendationPanel) passes the childId.
 */
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { generateRecommendations } from '../data/activityRecommendations';

/**
 * Fetches the most recent milestone assessment for the given child and
 * computes activity recommendations from the stored domainScores.
 *
 * Returns null if no assessment exists yet (e.g. child hasn't taken one).
 *
 * @param {string} childId  — Firestore child profile ID
 * @returns {Promise<{
 *   assessmentData: object,       — raw Firestore document data
 *   recommendations: object[],    — enriched activity list (up to 4)
 *   domainScores: object,         — raw domainScores map for rendering
 * } | null>}
 */
export async function getChildRecommendations(childId) {
  if (!childId) return null;

  try {
    const q = query(
      collection(db, 'milestone_assessments'),
      where('childId', '==', childId),
      orderBy('completedAt', 'desc'),
      limit(1),
    );

    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docData   = snap.docs[0].data();
    const domainScores = docData.domainScores ?? {};

    return {
      assessmentData:  docData,
      recommendations: generateRecommendations(domainScores, 4),
      domainScores,
    };
  } catch (e) {
    console.error('[recommendationService] getChildRecommendations error:', e);
    return null;
  }
}
