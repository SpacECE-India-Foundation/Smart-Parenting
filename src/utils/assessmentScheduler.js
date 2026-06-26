/**
 * assessmentScheduler.js
 *
 * Determines whether to show the first-time or weekly assessment popup
 * on the child Home screen.
 *
 * Query strategy:
 *   - Uses ONLY where("childId", "==", childId) - no orderBy - to avoid
 *     requiring a composite Firestore index.
 *   - All documents for the child are fetched and sorted client-side by
 *     completedAt descending; the latest one is used for the date check.
 *
 * Return values:
 *   { status: 'none' }      - no assessment exists  -> show first-time popup
 *   { status: 'due' }       - latest assessment >= 7 days old -> show weekly popup
 *   { status: 'not-due' }   - latest assessment < 7 days ago  -> show nothing
 */
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Checks the milestone_assessments collection for the given child and
 * returns a scheduling status object.
 *
 * @param {string} childId - Firestore child profile / auth UID
 * @returns {Promise<{ status: 'none' | 'due' | 'not-due' }>}
 */
export async function checkAssessmentSchedule(childId) {
  if (!childId) return { status: 'none' };

  try {
    // Single-field query only - no composite index needed
    const q = query(
      collection(db, 'milestone_assessments'),
      where('childId', '==', childId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { status: 'none' };
    }

    // Client-side sort: latest completedAt first
    const docs = snapshot.docs.map((d) => d.data());
    docs.sort((a, b) => {
      const ta = a.completedAt?.toDate?.()?.getTime?.() ?? 0;
      const tb = b.completedAt?.toDate?.()?.getTime?.() ?? 0;
      return tb - ta;
    });

    const latest = docs[0];
    const completedAtDate = latest.completedAt?.toDate?.();

    if (!completedAtDate) {
      return { status: 'not-due' };
    }

    const daysSince = Date.now() - completedAtDate.getTime();

    if (daysSince >= SEVEN_DAYS_MS) {
      return { status: 'due' };
    }

    return { status: 'not-due' };
  } catch (e) {
    console.error('[assessmentScheduler] checkAssessmentSchedule error:', e);
    return { status: 'not-due' };
  }
}
