/**
 * AssessmentModule.jsx — First-Time Child Onboarding Assessment
 *
 * An immersive, gamified assessment page that evaluates basic
 * Numeracy, Logic, and Literacy skills through 3 interactive questions.
 * Runs full-screen (no sidebar/nav) and saves results to Firebase.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useUser } from '../../context/UserContext';
import { updateUserProfile, awardProgress } from '../../firebase/services';
import './AssessmentModule.css';

/* ──────────────────────────────────────────────────────────────
   QUESTION DATA
   ────────────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 'counting',
    type: 'numeracy',
    label: '🔢 Numeracy',
    title: 'Count the Stars!',
    hint: 'How many ⭐ stars can you see floating below?',
    items: ['⭐', '⭐', '⭐', '⭐', '⭐'],
    options: [
      { value: 3, emoji: '3️⃣', text: '3' },
      { value: 5, emoji: '5️⃣', text: '5' },
      { value: 7, emoji: '7️⃣', text: '7' },
      { value: 4, emoji: '4️⃣', text: '4' },
    ],
    answer: 5,
    correctMsg: '🎉 Amazing! You counted all 5 stars perfectly!',
    wrongMsg: 'Almost! Count again — there are 5 stars up there! ⭐',
  },
  {
    id: 'pattern',
    type: 'logic',
    label: '🧠 Logic',
    title: 'What Comes Next?',
    hint: 'Look at the pattern and pick the missing piece!',
    pattern: ['🔴', '🔵', '🔴', '🔵'],
    options: [
      { value: '🔴', emoji: '🔴', text: 'Red' },
      { value: '🟢', emoji: '🟢', text: 'Green' },
      { value: '🔵', emoji: '🔵', text: 'Blue' },
      { value: '🟡', emoji: '🟡', text: 'Yellow' },
    ],
    answer: '🔴',
    correctMsg: '🧠 Brilliant! Red comes next in the pattern!',
    wrongMsg: 'Not quite! The pattern is Red, Blue, Red, Blue — so Red is next!',
  },
  {
    id: 'alphabet',
    type: 'literacy',
    label: '📖 Literacy',
    title: 'What letter does this word start with?',
    hint: 'Look at the picture and the word carefully!',
    word: { emoji: '🚀', text: 'Rocket' },
    options: [
      { value: 'R', emoji: '🅡', text: 'R' },
      { value: 'A', emoji: '🅐', text: 'A' },
      { value: 'M', emoji: '🅜', text: 'M' },
      { value: 'S', emoji: '🅢', text: 'S' },
    ],
    answer: 'R',
    correctMsg: '📖 Wonderful! "Rocket" starts with the letter R!',
    wrongMsg: 'Oops! Look at the first letter of "Rocket" — it starts with R!',
  },
  {
    id: 'fruits',
    type: 'numeracy',
    label: '🔢 Numeracy',
    title: 'Count the Apples!',
    hint: 'How many 🍎 apples can you find floating around?',
    items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎'],
    options: [
      { value: 4, emoji: '4️⃣', text: '4' },
      { value: 6, emoji: '6️⃣', text: '6' },
      { value: 8, emoji: '8️⃣', text: '8' },
      { value: 5, emoji: '5️⃣', text: '5' },
    ],
    answer: 6,
    correctMsg: '🎉 Awesome! You found all 6 apples!',
    wrongMsg: 'Count again! Try counting the apples one by one.',
  },
  {
    id: 'animal-pattern',
    type: 'logic',
    label: '🧠 Logic',
    title: 'Complete the Animal Train!',
    hint: 'Which animal comes next in the train?',
    pattern: ['🐱', '🐶', '🐱', '🐶'],
    options: [
      { value: '🐱', emoji: '🐱', text: 'Cat' },
      { value: '🐶', emoji: '🐶', text: 'Dog' },
      { value: '🦁', emoji: '🦁', text: 'Lion' },
      { value: '🐰', emoji: '🐰', text: 'Rabbit' },
    ],
    answer: '🐱',
    correctMsg: '🐱 Purr-fect! A cute cat is next in the pattern!',
    wrongMsg: 'Let\'s look closely: Cat, Dog, Cat, Dog... so a Cat is next!',
  },
  {
    id: 'lion-word',
    type: 'literacy',
    label: '📖 Literacy',
    title: 'Find the Starting Letter!',
    hint: 'What letter does "Lion" start with?',
    word: { emoji: '🦁', text: 'Lion' },
    options: [
      { value: 'L', emoji: '🅛', text: 'L' },
      { value: 'T', emoji: '🅣', text: 'T' },
      { value: 'B', emoji: '🅑', text: 'B' },
      { value: 'K', emoji: '🅚', text: 'K' },
    ],
    answer: 'L',
    correctMsg: '🦁 Great job! "Lion" starts with the letter L!',
    wrongMsg: 'Oops! L is for Lion. Try again!',
  },
  {
    id: 'color-match',
    type: 'logic',
    label: '🧠 Logic',
    title: 'Find the Missing Color!',
    hint: 'Blue, Green, Blue, Green... what comes next?',
    pattern: ['🔵', '🟢', '🔵', '🟢'],
    options: [
      { value: '🔵', emoji: '🔵', text: 'Blue' },
      { value: '🟢', emoji: '🟢', text: 'Green' },
      { value: '🟡', emoji: '🟡', text: 'Yellow' },
      { value: '🟣', emoji: '🟣', text: 'Purple' },
    ],
    answer: '🔵',
    correctMsg: '🔵 Spot on! Blue is the next color in line!',
    wrongMsg: 'Not quite. The pattern alternates: Blue, Green, Blue, Green — so Blue comes next!',
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

/* ──────────────────────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────────────────────── */
export default function AssessmentModule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, refreshProfile } = useUser();

  const queryParams = new URLSearchParams(location.search);
  const isManualStart = queryParams.get('start') === 'true';

  // Screens: 0 = welcome, 1–3 = questions, 4 = score
  const [screen, setScreen] = useState(isManualStart ? 1 : 0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]); // track correct/wrong per Q
  const [showConfetti, setShowConfetti] = useState(false);
  const [saving, setSaving] = useState(false);

  // If assessment already completed, redirect to dashboard unless started manually
  useEffect(() => {
    if (profile && profile.assessmentCompleted && !isManualStart) {
      navigate('/child/dashboard', { replace: true });
    }
  }, [profile, navigate, isManualStart]);

  // Current question data (screen 1–3 → question 0–2)
  const currentQ = screen >= 1 && screen <= TOTAL_QUESTIONS ? QUESTIONS[screen - 1] : null;

  // Score computation
  const score = useMemo(() => {
    const correct = answers.filter(Boolean).length;
    return Math.round((correct / TOTAL_QUESTIONS) * 100);
  }, [answers]);

  const handleSelect = useCallback((value) => {
    if (answered) return;
    setSelected(value);
  }, [answered]);

  const handleSubmitAnswer = useCallback(() => {
    if (selected === null || !currentQ) return;
    const correct = selected === currentQ.answer;
    setIsCorrect(correct);
    setAnswered(true);
    setAnswers(prev => [...prev, correct]);
  }, [selected, currentQ]);

  const handleNext = useCallback(() => {
    if (screen < TOTAL_QUESTIONS) {
      setScreen(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(false);
    } else {
      // Move to score screen
      setScreen(TOTAL_QUESTIONS + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  }, [screen]);

  const handleFinish = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const uid = user?.uid;
      if (uid) {
        // Save assessment completion & score
        await updateUserProfile(uid, {
          assessmentCompleted: true,
          assessmentScore: score,
        });
        // Award bonus XP and stars
        await awardProgress(uid, {
          xp: 30,
          stars: 3,
          coins: 10,
          module: 'assessment',
        });
        await refreshProfile();
      }
    } catch (e) {
      console.error('Failed to save assessment results:', e);
    }
    navigate('/child/dashboard', { replace: true });
  }, [saving, user, score, refreshProfile, navigate]);

  // Window dimensions for Confetti
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Render ── */
  return (
    <div className="assessment-page">
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={dims.w}
          height={dims.h}
          numberOfPieces={280}
          recycle={false}
          colors={['#F4A300', '#7C4DFF', '#FF6B9D', '#66BB6A', '#4FC3F7', '#FFD54F']}
        />
      )}

      {/* Animated background stars */}
      <div className="assessment-bg-decor">
        <span className="bg-star">⭐</span>
        <span className="bg-star">🌟</span>
        <span className="bg-star">✨</span>
        <span className="bg-star">💫</span>
        <span className="bg-star">🪐</span>
        <span className="bg-star">🌙</span>
        <span className="bg-star">☀️</span>
        <span className="bg-star">🌈</span>
      </div>

      <div className="assessment-card">
        {/* ── Progress Stepper (visible during questions) ── */}
        {screen >= 1 && screen <= TOTAL_QUESTIONS && (
          <div className="assessment-stepper">
            {QUESTIONS.map((q, i) => {
              const stepNum = i + 1;
              const isActive = screen === stepNum;
              const isDone = screen > stepNum;
              return (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    className={`stepper-dot ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  />
                  {i < QUESTIONS.length - 1 && (
                    <div className={`stepper-connector ${isDone ? 'completed' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════
            SCREEN 0: Welcome
        ═══════════════════════════════════ */}
        {screen === 0 && (
          <div>
            <span className="assessment-welcome-emoji">🧑‍🚀</span>
            <h1 className="assessment-welcome-title">Welcome, Explorer!</h1>
            <p className="assessment-welcome-subtitle">
              Before we explore the universe, let's see what you already know!
              Complete <strong>{TOTAL_QUESTIONS} quick activities</strong> — it only takes a minute.
            </p>
            <div className="assessment-welcome-features">
              <div className="welcome-feature">
                <span className="welcome-feature-icon">🔢</span>
                <span className="welcome-feature-label">Counting</span>
              </div>
              <div className="welcome-feature">
                <span className="welcome-feature-icon">🧠</span>
                <span className="welcome-feature-label">Patterns</span>
              </div>
              <div className="welcome-feature">
                <span className="welcome-feature-icon">📖</span>
                <span className="welcome-feature-label">Letters</span>
              </div>
            </div>
            <button className="assessment-btn primary" onClick={() => setScreen(1)}>
              🚀 Start Assessment
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════
            SCREENS 1–3: Questions
        ═══════════════════════════════════ */}
        {currentQ && (
          <div>
            <span className={`assessment-question-label ${currentQ.type}`}>
              {currentQ.label} — Question {screen} of {TOTAL_QUESTIONS}
            </span>

            <h2 className="assessment-question-title">{currentQ.title}</h2>
            <p className="assessment-question-hint">{currentQ.hint}</p>

            {/* Visual area */}
            <div className="assessment-visual-area">
              {/* Numeracy: floating items */}
              {currentQ.items && currentQ.items.map((item, i) => (
                <span key={i} className="floating-item">{item}</span>
              ))}

              {/* Logic: pattern sequence */}
              {currentQ.pattern && (
                <>
                  {currentQ.pattern.map((p, i) => (
                    <span key={i} className="pattern-item">{p}</span>
                  ))}
                  <span className="pattern-item mystery">❓</span>
                </>
              )}

              {/* Literacy: word visual */}
              {currentQ.word && (
                <div className="word-visual">
                  <span className="word-visual-emoji">{currentQ.word.emoji}</span>
                  <span className="word-visual-underline">
                    <span className="highlight-letter">{currentQ.word.text[0]}</span>
                    <span className="dim-letter">{currentQ.word.text.slice(1)}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="assessment-options">
              {currentQ.options.map((opt) => {
                let cls = 'option-card';
                if (answered && selected === opt.value) {
                  cls += isCorrect ? ' correct' : ' wrong';
                } else if (selected === opt.value) {
                  cls += ' selected';
                }
                return (
                  <div
                    key={opt.value}
                    className={cls}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span className="option-card-emoji">{opt.emoji}</span>
                    <span className="option-card-text">{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <div className={`assessment-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                <span className="assessment-feedback-icon">
                  {isCorrect ? '✅' : '❌'}
                </span>
                {isCorrect ? currentQ.correctMsg : currentQ.wrongMsg}
              </div>
            )}

            {/* Submit / Next */}
            {!answered ? (
              <button
                className="assessment-btn primary"
                disabled={selected === null}
                onClick={handleSubmitAnswer}
              >
                ✨ Check Answer
              </button>
            ) : (
              <button className="assessment-btn cosmic" onClick={handleNext}>
                {screen < TOTAL_QUESTIONS ? 'Next Question →' : '🎉 See My Score!'}
              </button>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════
            SCREEN 4: Score & Celebration
        ═══════════════════════════════════ */}
        {screen === TOTAL_QUESTIONS + 1 && (
          <div className="score-screen">
            <span className="score-trophy">🏆</span>
            <h2 className="score-title">Assessment Complete!</h2>
            <p className="score-subtitle">
              {score === 100
                ? 'Perfect score — you\'re a superstar! 🌟'
                : score >= 66
                  ? 'Great job, Explorer! You\'re ready for the adventure!'
                  : 'Nice try! Every explorer starts somewhere. Let\'s learn together!'}
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
                <span className="reward-chip-icon">⚡</span> +30 XP
              </div>
              <div className="reward-chip stars">
                <span className="reward-chip-icon">⭐</span> +3 Stars
              </div>
              <div className="reward-chip badge">
                <span className="reward-chip-icon">🪙</span> +10 Coins
              </div>
            </div>

            {/* Breakdown */}
            <div className="score-breakdown">
              {QUESTIONS.map((q, i) => (
                <div key={q.id} className="breakdown-item">
                  <span className="breakdown-icon">
                    {q.type === 'numeracy' ? '🔢' : q.type === 'logic' ? '🧠' : '📖'}
                  </span>
                  <span className="breakdown-text">{q.title}</span>
                  <span className="breakdown-result">
                    {answers[i] ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="assessment-btn primary"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? '⏳ Saving...' : '🚀 Go to Dashboard!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
