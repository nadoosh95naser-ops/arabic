import { LearningProgressState } from '../types/learning';

const STORAGE_KEY = 'arabic_verbs_journey_v1';

export function getInitialProgressState(): LearningProgressState {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    version: 1,
    lastValidStation: 'home',
    completedStations: [],
    settings: {
      muted: false,
      reduceMotion: prefersReducedMotion,
    },
    a1: {
      answers: {},
      attempts: {},
      completedQuestions: [],
    },
    a2: {
      visitedPortals: [],
      presentTimeView: 'now',
      compareAnswers: {},
      checkAnswer: '',
      checkPassed: false,
    },
    a3: {
      clickedIntroVerbs: [],
      hunterSelectedIds: [],
      hunterChecked: false,
      conjugation: {
        shurbAnswers: {},
        samaAnswers: {},
        shurbVerified: false,
        samaVerified: false,
        shurbBestScore: 0,
        samaBestScore: 0,
      },
      freeSentence: '',
      selfChecks: [false, false, false],
      sentenceSaved: false,
    },
    a4: {
      conceptAnswer: '',
      conceptSolved: false,
      exploredLetters: [],
      letterTrapAnswer: '',
      letterTrapSolved: false,
      conversionAnswers: {},
      conversionChecked: false,
      conjugationVerbIndex: 0,
      conjugationAnswers: {},
      conjugationCheckedVerbs: [],
      nowOrTomorrowAnswers: {},
      nowOrTomorrowChecked: false,
    },
    a5: {
      compareAnswer: '',
      compareSolved: false,
      situationsAnswers: {},
      situationsChecked: false,
      conjugationVerbIndex: 0,
      conjugationAnswers: {},
      conjugationCheckedVerbs: [],
      leaderInstructions: ['', ''],
      leaderSelfChecks: [false, false, false],
      leaderSaved: false,
    },
    a6: {
      placements: {},
      checked: false,
      attempts: 0,
    },
    a7: {
      pastSentence: '',
      presentSentence: '',
      imperativeSentence: '',
      pastChecks: [false, false],
      presentChecks: [false, false],
      imperativeChecks: [false, false],
      saved: false,
    },
    quiz: {
      currentAnswers: {},
      currentIndex: 0,
      inReview: false,
      viewingAttemptId: null,
      attempts: [],
    },
    a8: {
      pastSentence1: '',
      pastSentence2: '',
      presentNowSentence: '',
      presentTomorrowSentence: '',
      imperativeSentence1: '',
      imperativeSentence2: '',
      extractedVerbs: Array.from({ length: 6 }, () => ({ verb: '', type: '' })),
      chosenSentenceForExplanation: '',
      contextExplanation: '',
      rubricScores: {
        past: null,
        present: null,
        imperative: null,
        classification: null,
        clarity: null,
      },
      status: 'empty',
    },
  };
}

export function loadProgressState(): LearningProgressState {
  const defaults = getInitialProgressState();
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<LearningProgressState>;
    if (!parsed || typeof parsed !== 'object') return defaults;

    return {
      ...defaults,
      ...parsed,
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
      a1: { ...defaults.a1, ...(parsed.a1 || {}) },
      a2: { ...defaults.a2, ...(parsed.a2 || {}) },
      a3: {
        ...defaults.a3,
        ...(parsed.a3 || {}),
        conjugation: {
          ...defaults.a3.conjugation,
          ...(parsed.a3?.conjugation || {}),
        },
      },
      a4: { ...defaults.a4, ...(parsed.a4 || {}) },
      a5: { ...defaults.a5, ...(parsed.a5 || {}) },
      a6: { ...defaults.a6, ...(parsed.a6 || {}) },
      a7: { ...defaults.a7, ...(parsed.a7 || {}) },
      quiz: { ...defaults.quiz, ...(parsed.quiz || {}) },
      a8: {
        ...defaults.a8,
        ...(parsed.a8 || {}),
        rubricScores: {
          ...defaults.a8.rubricScores,
          ...(parsed.a8?.rubricScores || {}),
        },
      },
    };
  } catch {
    return defaults;
  }
}

export function saveProgressState(state: LearningProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function resetProgressState(): LearningProgressState {
  const fresh = getInitialProgressState();
  saveProgressState(fresh);
  return fresh;
}
