/**
 * AssessmentModule.jsx — Milestone-Based Child Onboarding Assessment
 *
 * Dynamically loads assessment questions from milestones_0_3.json based on
 * the active child's milestone_level (1-6, derived from date_of_birth).
 *
 * Key behaviours:
 *  - Observational mode: no "correct / wrong" feedback per question.
 *  - Milestone scoring: Yes = 2, Sometimes = 1, Not Yet = 0.
 *  - Final score = (totalEarned / maxPossible) x 100.
 *  - 7 randomly selected questions per attempt (all available if fewer).
 *  - "Coming Soon" screen for age groups without milestone data yet.
 *  - Modular: add future JSON files to MILESTONE_DATA_MAP only.
 *
 * Preserved from original:
 *  - Full-screen gamified UI, CSS classes, background stars, confetti.
 *  - Progress stepper, score ring, reward chips, breakdown table.
 *  - updateUserProfile + awardProgress calls (unchanged arguments).
 *  - Routing, auth, and all context wiring.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useUser } from '../../context/UserContext';
import { useChildProfile } from '../../context/ChildProfileContext';
import {
  updateUserProfile,
  awardProgress,
  saveMilestoneAssessmentResult,
} from '../../firebase/services';
import milestonesRaw from '../../data/milestones_0_3.json';
import './AssessmentModule.css';

/* --------------------------------------------------------------
   MILESTONE DATA MAP
   To support a new age group, import its JSON and add one entry here.
   No other code changes are needed.
   -------------------------------------------------------------- */
const MILESTONE_DATA_MAP = {
  '1-3': milestonesRaw,
  // '4-6':  milestones_4_6,   <- plug in when ready
  // '7-10': milestones_7_10,  <- plug in when ready
};

const QUESTIONS_PER_ATTEMPT = 7;

/* -- Domain -> emoji (visual area) ----------------------------- */
const DOMAIN_EMOJIS = {
  'Physical Development':  '\uD83C\uDFC3',
  'Language Development':  '\uD83D\uDCAC',
  'Cognitive Development': '\uD83E\uDDE0',
  'Social-Emotional':      '\u2764\uFE0F',
  'Fine Motor':            '\u270B',
  'Gross Motor':           '\uD83E\uDDB5',
  'Communication':         '\uD83D\uDCE2',
  'Self-Care':             '\uD83E\uDDFC',
};
const getDomainEmoji = (domain) => DOMAIN_EMOJIS[domain] || '\uD83D\uDCCB';

/* -- Option -> emoji ------------------------------------------- */
const OPTION_EMOJIS = { Yes: '\u2705', Sometimes: '\uD83D\uDD04', 'Not Yet': '\u23F3' };

/* --------------------------------------------------------------
   HELPERS
   -------------------------------------------------------------- */

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the input.
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Selects up to `count` questions for the given age group + milestone level
 * using a domain-balanced round-robin strategy:
 *   1. Filter questions to the requested level.
 *   2. Group by domain; shuffle within each domain for randomness.
 *   3. Shuffle domain order so no domain is always first.
 *   4. Round-robin: pick one question per domain per round until `count` reached.
 *   5. Final shuffle so domains are not shown in predictable blocks.
 *
 * This ensures diverse coverage across Physical, Language, Cognitive, etc.
 * even when the pool is large and unevenly distributed across domains.
 *
 * Adapted shape: { id, type, label, title, hint, options[], scoring, visual }
 * Note: no `answer`, `correctMsg`, or `wrongMsg` -- observational mode only.
 */
function adaptItem(item) {
  return {
    id:      item.id,
    type:    'milestone',
    label:   '\uD83D\uDCCB ' + item.domain,
    title:   item.skill,
    hint:    item.assessment_question,
    options: item.options.map((o) => ({
      value: o,
      emoji: OPTION_EMOJIS[o] || '\u2022',
      text:  o,
    })),
    scoring: item.scoring,
    visual: {
      type:   'milestone',
      domain: item.domain,
      emoji:  getDomainEmoji(item.domain),
    },
  };
}

function selectBalancedMilestoneQuestions(ageGroup, milestoneLevel, count = QUESTIONS_PER_ATTEMPT) {
  const pool = MILESTONE_DATA_MAP[ageGroup];
  if (!pool || milestoneLevel == null) return [];

  // 1. Filter to the target level
  const filtered = pool.filter((item) => item.level === milestoneLevel);
  if (filtered.length === 0) return [];

  // 2. Group by domain, shuffle within each group
  const byDomain = {};
  for (const item of filtered) {
    if (!byDomain[item.domain]) byDomain[item.domain] = [];
    byDomain[item.domain].push(item);
  }
  for (const domain of Object.keys(byDomain)) {
    byDomain[domain] = shuffleArray(byDomain[domain]);
  }

  // 3. Shuffle domain order so no domain is always prioritised
  const domains = shuffleArray(Object.keys(byDomain));

  // 4. Round-robin: one question per domain per round
  const selected = [];
  let round = 0;
  while (selected.length < count) {
    let addedThisRound = false;
    for (const domain of domains) {
      if (selected.length >= count) break;
      if (round < byDomain[domain].length) {
        selected.push(byDomain[domain][round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break; // no more questions available at any domain
    round++;
  }

  // 5. Final shuffle so domains are not shown in predictable order in the UI
  return shuffleArray(selected).map(adaptItem);
}

/* --------------------------------------------------------------
   COMPONENT
   -------------------------------------------------------------- */
export default function AssessmentModule() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, profile, refreshProfile } = useUser();
  const { activeChild } = useChildProfile();

  const queryParams   = new URLSearchParams(location.search);
  const isManualStart = queryParams.get('start') === 'true';

  const ageGroup       = activeChild?.age_group       ?? null;
  const milestoneLevel = activeChild?.milestone_level ?? null;

  const questions = useMemo(
    () => selectBalancedMilestoneQuestions(ageGroup, milestoneLevel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ageGroup, milestoneLevel],
  );
  const TOTAL_QUESTIONS = questions.length;

  const [screen,       setScreen]       = useState(isManualStart ? 1 : 0);
  const [selected,     setSelected]     = useState(null);
  const [answers,      setAnswers]      = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    if (profile && profile.assessmentCompleted && !isManualStart) {
      navigate('/child/dashboard', { replace: true });
    }
  }, [profile, navigate, isManualStart]);

  const currentQ =
    screen >= 1 && screen <= TOTAL_QUESTIONS ? questions[screen - 1] : null;

  const score = useMemo(() => {
    if (answers.length === 0 || TOTAL_QUESTIONS === 0) return 0;
    const totalEarned = answers.reduce((sum, a) => sum + a.score, 0);
    const maxPossible = TOTAL_QUESTIONS * 2;
    return Math.round((totalEarned / maxPossible) * 100);
  }, [answers, TOTAL_QUESTIONS]);

  /**
   * Per-domain scores derived from the current answers array.
   * Sorted lowest → highest percentage so areas needing attention appear first.
   * Shape: [{ domain, emoji, earned, maxPossible, percentage }]
   */
  const sortedDomainScores = useMemo(() => {
    const map = {};
    answers.forEach((a, i) => {
      const domain = questions[i]?.visual?.domain;
      if (!domain) return;
      if (!map[domain]) map[domain] = { earned: 0, maxPossible: 0 };
      map[domain].earned      += a.score;
      map[domain].maxPossible += 2;
    });
    return Object.entries(map)
      .map(([domain, { earned, maxPossible: mp }]) => ({
        domain,
        emoji:      getDomainEmoji(domain),
        earned,
        maxPossible: mp,
        percentage: mp > 0 ? Math.round((earned / mp) * 100) : 0,
      }))
      .sort((a, b) => a.percentage - b.percentage);
  }, [answers, questions]);

  const handleSelect = useCallback((value) => {
    setSelected(value);
  }, []);

  const handleNext = useCallback(() => {
    if (selected === null || !currentQ) return;
    const questionScore = currentQ.scoring?.[selected] ?? 0;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, selectedAnswer: selected, score: questionScore },
    ]);
    if (screen < TOTAL_QUESTIONS) {
      setScreen((prev) => prev + 1);
      setSelected(null);
    } else {
      setScreen(TOTAL_QUESTIONS + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [selected, currentQ, screen, TOTAL_QUESTIONS]);

  const handleFinish = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const uid = user?.uid;
      if (uid) {
        await updateUserProfile(uid, {
          assessmentCompleted: true,
          assessmentScore:     score,
        });
        await awardProgress(uid, {
          xp:     30,
          stars:  3,
          coins:  10,
          module: 'assessment',
        });
        // Save one document for the entire assessment session
        if (milestoneLevel) {
          // Compute per-domain scores so the recommendation system can consume
          // them directly without re-iterating the responses array.
          const domainScores = {};
          answers.forEach((a, i) => {
            const domain = questions[i]?.visual?.domain;
            if (!domain) return;
            if (!domainScores[domain]) {
              domainScores[domain] = { earned: 0, maxPossible: 0, percentage: 0 };
            }
            domainScores[domain].earned      += a.score;
            domainScores[domain].maxPossible += 2; // "Yes" = 2 is max per question
          });
          for (const domain of Object.keys(domainScores)) {
            const { earned, maxPossible } = domainScores[domain];
            domainScores[domain].percentage =
              maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;
          }

          await saveMilestoneAssessmentResult({
            childId:         uid,
            milestone_level: milestoneLevel,
            totalScore:      score,
            maxPossible:     TOTAL_QUESTIONS * 2,
            domainScores,
            responses:       answers.map((a) => ({
              questionId:     a.questionId,
              selectedAnswer: a.selectedAnswer,
              score:          a.score,
            })),
          });
        }
        await refreshProfile();
      }
    } catch (e) {
      console.error('Failed to save assessment results:', e);
    }
    navigate('/child/dashboard', { replace: true });
  }, [saving, user, score, answers, questions, milestoneLevel, refreshProfile, navigate]);

  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const BG_STARS = ['\u2B50', '\uD83C\uDF1F', '\u2728', '\uD83D\uDCAB', '\uD83E\uDE90', '\uD83C\uDF19', '\u2600\uFE0F', '\uD83C\uDF08'];

  /* -- Loading guard ------------------------------------------ */
  if (!activeChild) {
    return (
      <div className="assessment-page">
        <div className="assessment-bg-decor">
          {BG_STARS.map((s, i) => <span key={i} className="bg-star">{s}</span>)}
        </div>
        <div className="assessment-card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{'\u23F3'}</span>
          <p style={{ color: '#6B7280', fontWeight: 600 }}>Loading your profile{'\u2026'}</p>
        </div>
      </div>
    );
  }

  /* -- Coming Soon guard -------------------------------------- */
  const hasMilestoneData =
    ageGroup && milestoneLevel != null && MILESTONE_DATA_MAP[ageGroup];

  if (!hasMilestoneData) {
    return (
      <div className="assessment-page">
        <div className="assessment-bg-decor">
          {BG_STARS.map((s, i) => <span key={i} className="bg-star">{s}</span>)}
        </div>
        <div className="assessment-card">
          <span className="assessment-welcome-emoji">{'\uD83D\uDE80'}</span>
          <h1 className="assessment-welcome-title">Coming Soon!</h1>
          <p className="assessment-welcome-subtitle">
            Milestone assessments for the{' '}
            <strong>Age {ageGroup || 'selected'}</strong> group are being
            prepared by our team. Check back soon!
          </p>
          <button
            className="assessment-btn primary"
            onClick={() => navigate('/child/dashboard', { replace: true })}
          >
            {'\uD83C\uDFE0'} Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* -- Main render -------------------------------------------- */
  return (
    <div className="assessment-page">
      {showConfetti && (
        <Confetti
          width={dims.w}
          height={dims.h}
          numberOfPieces={280}
          recycle={false}
          colors={['#F4A300', '#7C4DFF', '#FF6B9D', '#66BB6A', '#4FC3F7', '#FFD54F']}
        />
      )}

      <div className="assessment-bg-decor">
        {BG_STARS.map((s, i) => <span key={i} className="bg-star">{s}</span>)}
      </div>

      <div className="assessment-card">
        {/* Progress Stepper */}
        {screen >= 1 && screen <= TOTAL_QUESTIONS && (
          <div className="assessment-stepper">
            {questions.map((q, i) => {
              const stepNum  = i + 1;
              const isActive = screen === stepNum;
              const isDone   = screen > stepNum;
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    className={`stepper-dot ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  />
                  {i < questions.length - 1 && (
                    <div className={`stepper-connector ${isDone ? 'completed' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SCREEN 0: Welcome */}
        {screen === 0 && (
          <div>
            <span className="assessment-welcome-emoji">{'\uD83E\uDDD1\u200D\uD83D\uDE80'}</span>
            <h1 className="assessment-welcome-title">Milestone Check-In!</h1>
            <p className="assessment-welcome-subtitle">
              {"Let's observe your little one's development milestones. Complete "}
              <strong>{TOTAL_QUESTIONS} quick activities</strong>
              {' \u2014 it only takes a minute.'}
            </p>
            <div className="assessment-welcome-features">
              <div className="welcome-feature">
                <span className="welcome-feature-icon">{'\uD83C\uDFC3'}</span>
                <span className="welcome-feature-label">Physical</span>
              </div>
              <div className="welcome-feature">
                <span className="welcome-feature-icon">{'\uD83D\uDCAC'}</span>
                <span className="welcome-feature-label">Language</span>
              </div>
              <div className="welcome-feature">
                <span className="welcome-feature-icon">{'\uD83E\uDDE0'}</span>
                <span className="welcome-feature-label">Cognitive</span>
              </div>
            </div>
            <button className="assessment-btn primary" onClick={() => setScreen(1)}>
              {'\uD83D\uDE80'} Start Assessment
            </button>
          </div>
        )}

        {/* SCREENS 1-N: Questions (observational -- no feedback) */}
        {currentQ && (
          <div>
            <span className={`assessment-question-label ${currentQ.type}`}>
              {currentQ.label} {'\u2014'} Question {screen} of {TOTAL_QUESTIONS}
            </span>

            <h2 className="assessment-question-title">{currentQ.title}</h2>
            <p className="assessment-question-hint">{currentQ.hint}</p>

            {/* Visual area -- milestone domain badge */}
            <div className="assessment-visual-area">
              {currentQ.visual?.type === 'milestone' && (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.4rem' }}>
                    {currentQ.visual.emoji}
                  </span>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700, color: '#6B7280',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {currentQ.visual.domain}
                  </span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="assessment-options">
              {currentQ.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`option-card${selected === opt.value ? ' selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="option-card-emoji">{opt.emoji}</span>
                  <span className="option-card-text">{opt.text}</span>
                </div>
              ))}
            </div>

            {/* Single Next button -- no Check Answer step */}
            <button
              className="assessment-btn cosmic"
              disabled={selected === null}
              onClick={handleNext}
            >
              {screen < TOTAL_QUESTIONS ? 'Next Question \u2192' : '\uD83C\uDF89 See Results!'}
            </button>
          </div>
        )}

        {/* SCREEN N+1: Score & Celebration */}
        {screen === TOTAL_QUESTIONS + 1 && (
          <div className="score-screen">
            <span className="score-trophy">{'\uD83C\uDFC6'}</span>
            <h2 className="score-title">Assessment Complete!</h2>
            <p className="score-subtitle">
              {score === 100
                ? "Outstanding! Your child is hitting all milestones! \uD83C\uDF1F"
                : score >= 66
                  ? 'Great progress! Your child is developing well!'
                  : 'Every child grows at their own pace. Keep encouraging them!'}
            </p>

            {/* Score Ring */}
            <div className="score-display">
              <div className="score-ring">
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C4DFF" />
                      <stop offset="100%" stopColor="#FF6B9D" />
                    </linearGradient>
                  </defs>
                  <circle className="score-ring-bg" cx="65" cy="65" r="56" />
                  <circle
                    className="score-ring-fill"
                    cx="65" cy="65" r="56"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - score / 100)}
                  />
                </svg>
                <div className="score-ring-inner">
                  <span className="score-ring-value">{score}%</span>
                  <span className="score-ring-label">Score</span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="score-rewards">
              <div className="reward-chip xp">
                <span className="reward-chip-icon">{'\u26A1'}</span> +30 XP
              </div>
              <div className="reward-chip stars">
                <span className="reward-chip-icon">{'\u2B50'}</span> +3 Stars
              </div>
              <div className="reward-chip badge">
                <span className="reward-chip-icon">{'\uD83E\uDE99'}</span> +10 Coins
              </div>
            </div>

            {/* Development Summary — domain-wise performance */}
            <div className="domain-summary">
              <h3 className="domain-summary-title">
                {'\uD83D\uDCCA'} Development Summary
              </h3>
              <p className="domain-summary-hint">
                Areas listed from most to least attention needed
              </p>
              <div className="domain-summary-list">
                {sortedDomainScores.map(({ domain, emoji, percentage }) => {
                  const isExcellent   = percentage >= 80;
                  const isDeveloping  = percentage >= 60 && percentage < 80;
                  const badgeClass    = isExcellent ? 'badge-excellent'
                                      : isDeveloping ? 'badge-developing'
                                      : 'badge-attention';
                  const badgeLabel    = isExcellent ? 'Excellent'
                                      : isDeveloping ? 'Developing Well'
                                      : 'Needs Attention';
                  return (
                    <div key={domain} className="domain-row">
                      <span className="domain-row-emoji">{emoji}</span>
                      <span className="domain-row-name">{domain}</span>
                      <div className="domain-row-bar-wrap">
                        <div
                          className="domain-row-bar-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="domain-row-pct">{percentage}%</span>
                      <span className={`domain-status-badge ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              className="assessment-btn primary"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? '\u23F3 Saving...' : '\uD83D\uDE80 Go to Dashboard!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
