import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_SKILL_LABELS } from '../data/quizData';
import { LearningProgressState, QuizAttempt } from '../types/learning';
import { GuideBanner } from '../components/GuideBanner';
import { ArabicVerbInput } from '../components/ArabicVerbInput';
import { evaluateConjugatedVerb } from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationQuizProps {
  state: LearningProgressState['quiz'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['quiz']) => void;
  onComplete: () => void;
}

export const StationQuiz: React.FC<StationQuizProps> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const viewingSubmittedAttempt = state.viewingAttemptId
    ? state.attempts.find((a) => a.id === state.viewingAttemptId) || null
    : null;

  const currentQuestion = QUIZ_QUESTIONS[state.currentIndex] || QUIZ_QUESTIONS[0];

  const isQuestionAnswered = (qId: string): boolean => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === qId);
    if (!q) return false;
    const ans = state.currentAnswers[qId];
    if (q.kind === 'mcq') {
      return typeof ans === 'string' && ans.length > 0;
    }
    const tableAns = (ans as Record<string, string>) || {};
    return q.entries.some((e) => Boolean((tableAns[e.pronounId] || '').trim()));
  };

  const handleSubmitAttempt = () => {
    let totalScore = 0;
    let correctCount = 0;
    let q13CorrectSubfields = 0;

    const skillBreakdown: QuizAttempt['skillBreakdown'] = {};
    (Object.keys(QUIZ_SKILL_LABELS) as Array<keyof typeof QUIZ_SKILL_LABELS>).forEach((k) => {
      skillBreakdown[k] = { earned: 0, max: 0, label: QUIZ_SKILL_LABELS[k].label };
    });

    QUIZ_QUESTIONS.forEach((q) => {
      skillBreakdown[q.skillKey].max += 1;
      if (q.kind === 'mcq') {
        const userAns = state.currentAnswers[q.id];
        if (userAns === q.correctAnswer) {
          totalScore += 1;
          correctCount += 1;
          skillBreakdown[q.skillKey].earned += 1;
        }
      } else {
        const tableAns = (state.currentAnswers[q.id] as Record<string, string>) || {};
        let subCorrect = 0;
        q.entries.forEach((entry) => {
          const res = evaluateConjugatedVerb(tableAns[entry.pronounId] || '', entry, q.entries);
          if (res.status === 'exact') {
            subCorrect += 1;
          }
        });
        q13CorrectSubfields = subCorrect;
        const partial = Number((subCorrect / 9).toFixed(2));
        totalScore += partial;
        if (subCorrect === 9) correctCount += 1;
        skillBreakdown[q.skillKey].earned = Number(
          (skillBreakdown[q.skillKey].earned + partial).toFixed(2)
        );
      }
    });

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      timestamp: Date.now(),
      answers: state.currentAnswers,
      score: Number(totalScore.toFixed(2)),
      maxScore: 13,
      correctCount,
      q13CorrectSubfields,
      skillBreakdown,
    };

    audioManager.playTone('success');
    onUpdate({
      ...state,
      inReview: false,
      viewingAttemptId: newAttempt.id,
      attempts: [...state.attempts, newAttempt],
    });
  };

  const handleStartNewAttempt = () => {
    onUpdate({
      ...state,
      currentAnswers: {},
      currentIndex: 0,
      inReview: false,
      viewingAttemptId: null,
    });
  };

  // Post-Submission Results & Explanations View
  if (viewingSubmittedAttempt) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <GuideBanner
          title="نتيجةُ الاختبارِ الختاميِّ وتفسيراتُ الأسئلةِ"
          message="أحسنتَ على إتمامِ التحدّي النهائيِّ! راجعْ نتيجتَكَ حسبَ كلِّ مهارةٍ واقرأِ التفسيراتِ لكلِّ سؤالٍ."
          muted={muted}
          tone="success"
        />

        {/* Score Summary */}
        <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-center">
            <p className="text-xs font-bold text-teal-800">النتيجةُ الموضوعيةُ</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-teal-950 tabular-nums">
              {viewingSubmittedAttempt.score} / 13
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs font-bold text-slate-600">الأسئلةُ المكتملةُ بدقةٍ تامةٍ</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
              {viewingSubmittedAttempt.correctCount} من 13
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-center">
            <p className="text-xs font-bold text-amber-800">البندُ 13 (إسنادُ الماضي)</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-amber-950 tabular-nums">
              {viewingSubmittedAttempt.q13CorrectSubfields} / 9
            </p>
          </div>
        </section>

        {/* Skill Breakdown */}
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-slate-900">
            توزيعُ الأداءِ حسبَ المهارةِ
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(viewingSubmittedAttempt.skillBreakdown).map(([key, item]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-bold text-slate-800">{item.label}</span>
                <span className="font-display font-extrabold text-teal-800 tabular-nums">
                  {item.earned} / {item.max}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Explanations for all 13 Questions */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">
            مراجعةُ الإجاباتِ والتفسيراتِ (1 – 13)
          </h2>
          {QUIZ_QUESTIONS.map((q) => {
            if (q.kind === 'mcq') {
              const userAns = String(viewingSubmittedAttempt.answers[q.id] || 'لم يُجبْ');
              const isOk = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`space-y-2 rounded-2xl border p-5 ${
                    isOk ? 'border-emerald-200 bg-white' : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="text-slate-500">
                      السؤالُ {q.number} · {q.skillLabel}
                    </span>
                    {isOk ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> إجابةٌ صحيحةٌ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800">
                        <XCircle className="h-4 w-4" /> تحتاجُ مراجعةً
                      </span>
                    )}
                  </div>
                  <p className="font-display text-base font-bold text-slate-900">{q.prompt}</p>
                  <p className="text-sm text-slate-700">
                    إجابتُكَ: <strong>{userAns}</strong> · الإجابةُ الصحيحةُ:{' '}
                    <strong className="text-emerald-800">{q.correctAnswer}</strong>
                  </p>
                  <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                    {q.explanation}
                  </p>
                </div>
              );
            }

            // Q13
            const tableAns =
              (viewingSubmittedAttempt.answers[q.id] as Record<string, string>) || {};
            return (
              <div key={q.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">
                    السؤالُ 13 · {q.skillLabel}
                  </span>
                  <span className="text-teal-800 tabular-nums">
                    {viewingSubmittedAttempt.q13CorrectSubfields} من 9 صيغٍ صحيحةٍ
                  </span>
                </div>
                <p className="font-display text-base font-bold text-slate-900">{q.prompt}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {q.entries.map((entry) => {
                    const res = evaluateConjugatedVerb(
                      tableAns[entry.pronounId] || '',
                      entry,
                      q.entries
                    );
                    return (
                      <div
                        key={entry.pronounId}
                        className={`rounded-xl border p-2.5 text-xs ${
                          res.status === 'exact'
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <p className="font-bold text-slate-900">
                          {entry.pronounLabel}: {tableAns[entry.pronounId] || '—'}
                        </p>
                        <p className="text-slate-700">الصحيحُ: {entry.validForms[0]}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-600">{q.explanation}</p>
              </div>
            );
          })}
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <button
            type="button"
            onClick={handleStartNewAttempt}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>بدءُ محاولةٍ جديدةٍ ({state.attempts.length} محفوظةٌ)</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700"
          >
            <span>الانتقالُ إلى مهمةِ ركنِ القراءةِ (A8)</span>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // Review Screen Before Submission
  if (state.inReview) {
    const answeredCount = QUIZ_QUESTIONS.filter((q) => isQuestionAnswered(q.id)).length;
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-teal-700">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            <h1 className="font-display text-2xl font-bold text-slate-900">
              مراجعةُ الاختبارِ قبلَ التسليمِ
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            أجبتَ عنْ {answeredCount} من 13 سؤالاً. يمكنك العودةُ لأيِّ سؤالٍ لتعديلِ إجابتِكَ،
            وعندَ الجاهزيةِ اضغطْ «تسليمُ الاختبارِ».
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const answered = isQuestionAnswered(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onUpdate({ ...state, inReview: false, currentIndex: idx })}
                  className={`flex min-h-[52px] flex-col items-start justify-center rounded-xl border p-3 text-right transition-colors ${
                    answered
                      ? 'border-teal-300 bg-teal-50/70 text-teal-950'
                      : 'border-amber-300 bg-amber-50 text-amber-950'
                  }`}
                >
                  <span className="font-display text-sm font-bold">السؤالُ {q.number}</span>
                  <span className="text-xs">{answered ? 'تمتِ الإجابةُ' : 'لم يُجبْ بعدُ'}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <button
              type="button"
              onClick={() => onUpdate({ ...state, inReview: false })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>العودةُ إلى الأسئلةِ</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-teal-600 px-7 py-3 text-base font-bold text-white hover:bg-teal-700"
            >
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span>تسليمُ الاختبارِ وعرضُ النتيجةِ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Single-Question-Per-Screen View (No Answer Reveal During Quiz)
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <p className="text-xs font-bold text-teal-700">{currentQuestion.skillLabel}</p>
          <h1 className="font-display text-lg font-bold text-slate-900 tabular-nums">
            السؤالُ {currentQuestion.number} من 13
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {state.attempts.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  ...state,
                  viewingAttemptId: state.attempts[state.attempts.length - 1].id,
                })
              }
              className="min-h-[38px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              عرضُ المحاولةِ السابقةِ
            </button>
          )}
          <button
            type="button"
            onClick={() => onUpdate({ ...state, inReview: true })}
            className="min-h-[38px] rounded-xl border border-teal-300 bg-teal-50 px-4 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100"
          >
            صفحةُ المراجعةِ
          </button>
        </div>
      </div>

      {/* Question Card */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {currentQuestion.kind === 'mcq' ? (
          <>
            {currentQuestion.contextSentence && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-display text-xl font-bold text-slate-900">
                «{currentQuestion.contextSentence}»
              </div>
            )}
            <h2 className="font-display text-xl font-bold text-slate-900">
              {currentQuestion.prompt}
            </h2>
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const selected = state.currentAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...state,
                        currentAnswers: { ...state.currentAnswers, [currentQuestion.id]: opt },
                      })
                    }
                    className={`flex min-h-[50px] w-full items-center justify-between rounded-xl border px-4 py-3 text-right text-base font-bold transition-colors ${
                      selected
                        ? 'border-teal-600 bg-teal-50 text-teal-950'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold text-slate-900">
              {currentQuestion.prompt}
            </h2>
            <p className="text-sm text-slate-600">
              استخدمْ أزرارَ الحركاتِ المساعدةِ لتشكيلِ نهايةِ الفعلِ بدقةٍ مع «أنا، أنتَ، أنتِ».
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentQuestion.entries.map((entry) => {
                const tableAns =
                  (state.currentAnswers[currentQuestion.id] as Record<string, string>) || {};
                return (
                  <div
                    key={entry.pronounId}
                    className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <p className="font-display text-base font-bold text-slate-900">
                      الضميرُ: <span className="text-teal-700">{entry.pronounLabel}</span>
                    </p>
                    <ArabicVerbInput
                      id={`quiz-q13-${entry.pronounId}`}
                      label={`إسناد فتح للضمير ${entry.pronounLabel}`}
                      value={tableAns[entry.pronounId] || ''}
                      onChange={(nextVal) =>
                        onUpdate({
                          ...state,
                          currentAnswers: {
                            ...state.currentAnswers,
                            [currentQuestion.id]: {
                              ...tableAns,
                              [entry.pronounId]: nextVal,
                            },
                          },
                        })
                      }
                      placeholder="صيغةُ فتحَ..."
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={state.currentIndex === 0}
            onClick={() =>
              onUpdate({ ...state, currentIndex: Math.max(0, state.currentIndex - 1) })
            }
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>السؤالُ السابقُ</span>
          </button>

          {state.currentIndex < QUIZ_QUESTIONS.length - 1 ? (
            <button
              type="button"
              onClick={() => onUpdate({ ...state, currentIndex: state.currentIndex + 1 })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
            >
              <span>السؤالُ التالي</span>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onUpdate({ ...state, inReview: true })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>مراجعةُ الإجاباتِ والتسليمُ</span>
            </button>
          )}
        </div>
      </section>

      {isCompleted && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-800 hover:bg-teal-100"
          >
            <span>متابعةٌ إلى مهمةِ ركنِ القراءةِ (A8)</span>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
