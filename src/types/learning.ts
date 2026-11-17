export type StationId =
  | 'home'
  | 'map'
  | 'a1'
  | 'a2'
  | 'a3'
  | 'a4'
  | 'a5'
  | 'a6'
  | 'a7'
  | 'quiz'
  | 'a8'
  | 'results';

export type VerbType = 'past' | 'present' | 'imperative';

export interface StationMeta {
  id: Exclude<StationId, 'home' | 'map'>;
  order: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  requiresPrevious?: Exclude<StationId, 'home' | 'map'>;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  answers: Record<string, unknown>;
  score: number;
  maxScore: number;
  correctCount: number;
  q13CorrectSubfields: number;
  skillBreakdown: Record<string, { earned: number; max: number; label: string }>;
}

export interface PerformanceTaskState {
  pastSentence1: string;
  pastSentence2: string;
  presentNowSentence: string;
  presentTomorrowSentence: string;
  imperativeSentence1: string;
  imperativeSentence2: string;
  extractedVerbs: Array<{
    verb: string;
    type: VerbType | '';
  }>;
  chosenSentenceForExplanation: string;
  contextExplanation: string;
  rubricScores: {
    past: 0 | 1 | 2 | null;
    present: 0 | 1 | 2 | null;
    imperative: 0 | 1 | 2 | null;
    classification: 0 | 1 | 2 | null;
    clarity: 0 | 1 | 2 | null;
  };
  status: 'empty' | 'draft' | 'completed';
  savedAt?: number;
}

export interface A3ConjugationState {
  shurbAnswers: Record<string, string>;
  samaAnswers: Record<string, string>;
  shurbVerified: boolean;
  samaVerified: boolean;
  shurbBestScore: number;
  samaBestScore: number;
}

export interface LearningProgressState {
  version: number;
  lastValidStation: StationId;
  completedStations: Array<Exclude<StationId, 'home' | 'map'>>;
  settings: {
    muted: boolean;
    reduceMotion: boolean;
  };
  a1: {
    answers: Record<string, string>;
    attempts: Record<string, number>;
    completedQuestions: string[];
  };
  a2: {
    visitedPortals: VerbType[];
    presentTimeView: 'now' | 'tomorrow';
    compareAnswers: Record<string, string>;
    checkAnswer: string;
    checkPassed: boolean;
  };
  a3: {
    clickedIntroVerbs: string[];
    hunterSelectedIds: string[];
    hunterChecked: boolean;
    conjugation: A3ConjugationState;
    freeSentence: string;
    selfChecks: boolean[];
    sentenceSaved: boolean;
  };
  a4: {
    conceptAnswer: string;
    conceptSolved: boolean;
    exploredLetters: string[];
    letterTrapAnswer: string;
    letterTrapSolved: boolean;
    conversionAnswers: Record<string, string>;
    conversionChecked: boolean;
    conjugationVerbIndex: number;
    conjugationAnswers: Record<string, Record<string, string>>;
    conjugationCheckedVerbs: string[];
    nowOrTomorrowAnswers: Record<string, string>;
    nowOrTomorrowChecked: boolean;
  };
  a5: {
    compareAnswer: string;
    compareSolved: boolean;
    situationsAnswers: Record<string, string>;
    situationsChecked: boolean;
    conjugationVerbIndex: number;
    conjugationAnswers: Record<string, Record<string, string>>;
    conjugationCheckedVerbs: string[];
    leaderInstructions: string[];
    leaderSelfChecks: boolean[];
    leaderSaved: boolean;
  };
  a6: {
    placements: Record<string, VerbType>;
    checked: boolean;
    attempts: number;
  };
  a7: {
    pastSentence: string;
    presentSentence: string;
    imperativeSentence: string;
    pastChecks: boolean[];
    presentChecks: boolean[];
    imperativeChecks: boolean[];
    saved: boolean;
  };
  quiz: {
    currentAnswers: Record<string, unknown>;
    currentIndex: number;
    inReview: boolean;
    viewingAttemptId: string | null;
    attempts: QuizAttempt[];
  };
  a8: PerformanceTaskState;
}
