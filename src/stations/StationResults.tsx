import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Compass,
  FileCheck2,
  RotateCcw,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_SKILL_LABELS } from '../data/quizData';
import { LearningProgressState, StationId } from '../types/learning';
import { GuideBanner } from '../components/GuideBanner';
import { evaluateConjugatedVerb } from '../utils/arabicHelpers';

interface StationResultsProps {
  progress: LearningProgressState;
  onGoToStation: (station: StationId) => void;
  onRetakeQuiz: () => void;
}

export const StationResults: React.FC<StationResultsProps> = ({
  progress,
  onGoToStation,
  onRetakeQuiz,
}) => {
  const [showMistakes, setShowMistakes] = useState(false);

  const latestAttempt =
    progress.quiz.attempts.length > 0
      ? progress.quiz.attempts[progress.quiz.attempts.length - 1]
      : null;

  const bestPastLabScore = Math.max(
    progress.a3.conjugation.shurbBestScore,
    progress.a3.conjugation.samaBestScore
  );

  // Determine recommended review station based on lowest skill percentage in latest quiz
  let recommendedStation: StationId = 'a3';
  let recommendedSkillName = 'إسنادُ الفعلِ الماضي';
  let lowestRatio = 1.1;

  if (latestAttempt) {
    (
      Object.entries(latestAttempt.skillBreakdown) as Array<
        [keyof typeof QUIZ_SKILL_LABELS, { earned: number; max: number; label: string }]
      >
    ).forEach(([key, val]) => {
      if (val.max > 0) {
        const ratio = val.earned / val.max;
        if (ratio < lowestRatio) {
          lowestRatio = ratio;
          recommendedStation = QUIZ_SKILL_LABELS[key].reviewStation;
          recommendedSkillName = val.label;
        }
      }
    });
  }
  const allSkillsMastered = Boolean(latestAttempt) && lowestRatio >= 1;

  const a8StatusText =
    progress.a8.status === 'completed'
      ? 'مكتملةٌ'
      : progress.a8.status === 'draft'
        ? 'مسوّدةٌ'
        : 'قيدُ الإعدادِ';

  const a8RubricTotal = Object.values(progress.a8.rubricScores).reduce<number>(
    (acc, v) => acc + (v ?? 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="أنجزتَ رحلتَكَ اللغويةَ!"
        message="لقد استكشفتَ الماضيَ والمضارعَ والأمرَ، وأسهمتَ في تجهيزِ ركنِ القراءةِ. هذا ملفُّ مهاراتِكَ الذي يُظهرُ ما أتقنتَهُ وما تستطيعُ مراجعتَهُ لتزدادَ تميّزاً."
        audioId="results_banner"
        muted={progress.settings.muted}
        tone="success"
      />

      {/* Main Outcome Cards (Strictly separating Objective Quiz from Performance Task) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-teal-700">الاختبارُ الموضوعيُّ</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {latestAttempt ? `${latestAttempt.score} / 13` : '— / 13'}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            الإجاباتُ التامةُ: {latestAttempt ? latestAttempt.correctCount : 0} من 13
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-amber-700">إسنادُ الماضي (9 ضمائرَ)</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {latestAttempt ? `${latestAttempt.q13CorrectSubfields} / 9` : `${bestPastLabScore} / 9`}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            في مختبرِ A3: شرِبَ ({progress.a3.conjugation.shurbBestScore}/9) · سمِعَ (
            {progress.a3.conjugation.samaBestScore}/9)
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-emerald-700">المهمةُ الأدائيةُ (ركنُ القراءةِ)</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            {a8StatusText}
          </p>
          <p className="mt-1 text-xs text-slate-600 tabular-nums">
            المراجعةُ الذاتيةُ بالروبركِ: {a8RubricTotal} / 10 (منفصلةٌ عنِ الاختبارِ)
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-sky-700">محاولاتُ الاختبارِ المحفوظةُ</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {progress.quiz.attempts.length}
          </p>
          <p className="mt-1 text-xs text-slate-600">تُحفظُ تلقائياً على جهازِكَ</p>
        </div>
      </section>

      {/* Skill-by-Skill Performance & Constructive Recommendations */}
      {latestAttempt && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-slate-900">
              ملفُّ المهاراتِ والتوصياتُ البناءةُ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(
              Object.entries(latestAttempt.skillBreakdown) as Array<
                [keyof typeof QUIZ_SKILL_LABELS, { earned: number; max: number; label: string }]
              >
            ).map(([key, item]) => {
              const ratio = item.max > 0 ? item.earned / item.max : 0;
              const station = QUIZ_SKILL_LABELS[key].reviewStation;
              return (
                <div
                  key={key}
                  className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-bold text-slate-900">
                      {item.label}
                    </span>
                    <span className="font-display text-sm font-extrabold text-teal-800 tabular-nums">
                      {item.earned} / {item.max}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    {ratio >= 0.85 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> مهارةٌ متقنةٌ
                      </span>
                    ) : (
                      <span className="font-medium text-amber-800">
                        فرصةٌ رائعةٌ للمراجعةِ والتدربِ أكثرَ
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onGoToStation(station)}
                      className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-900"
                    >
                      راجعِ المحطةَ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Action Buttons Required by Section 16 */}
      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
        <button
          type="button"
          onClick={() => setShowMistakes((v) => !v)}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4 text-sky-600" aria-hidden="true" />
          <span>{showMistakes ? 'إخفاءُ مراجعةِ الأخطاءِ' : 'راجعْ أخطائي'}</span>
        </button>

        <button
          type="button"
          onClick={onRetakeQuiz}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-5 py-2.5 text-sm font-bold text-teal-900 hover:bg-teal-100"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>أعدِ الاختبارَ</span>
        </button>

        <button
          type="button"
          onClick={() => onGoToStation(allSkillsMastered ? 'map' : recommendedStation)}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span>
            {allSkillsMastered
              ? 'جميعُ المهاراتِ متقنةٌ! استعرضِ المحطاتِ منَ الخريطةِ'
              : `ارجعْ إلى المحطةِ التي تحتاجُ إلى مراجعتِها (${recommendedSkillName})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onGoToStation('map')}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          <span>خريطةُ الرحلةِ</span>
        </button>
      </section>

      {/* Expandable Mistakes Review */}
      {showMistakes && latestAttempt && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-amber-700" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              الأسئلةُ التي تحتاجُ إلى مراجعةٍ في آخرِ محاولةٍ
            </h3>
          </div>

          {QUIZ_QUESTIONS.filter((q) => {
            if (q.kind === 'mcq') {
              return latestAttempt.answers[q.id] !== q.correctAnswer;
            }
            return latestAttempt.q13CorrectSubfields < 9;
          }).length === 0 ? (
            <p className="text-sm font-bold text-emerald-700">
              ما شاء الله! لم تخطئْ في أيِّ سؤالٍ في هذهِ المحاولةِ.
            </p>
          ) : (
            <div className="space-y-3">
              {QUIZ_QUESTIONS.map((q) => {
                if (q.kind === 'mcq') {
                  const userAns = String(latestAttempt.answers[q.id] || 'لم يُجبْ');
                  if (userAns === q.correctAnswer) return null;
                  return (
                    <div
                      key={q.id}
                      className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-sm"
                    >
                      <p className="font-bold text-slate-900">
                        السؤالُ {q.number}: {q.prompt}
                      </p>
                      <p className="text-slate-700">
                        إجابتُكَ: <strong>{userAns}</strong> · الصوابُ:{' '}
                        <strong className="text-emerald-800">{q.correctAnswer}</strong>
                      </p>
                      <p className="text-xs text-slate-600">{q.explanation}</p>
                    </div>
                  );
                }

                if (latestAttempt.q13CorrectSubfields === 9) return null;
                const tableAns =
                  (latestAttempt.answers[q.id] as Record<string, string>) || {};
                return (
                  <div
                    key={q.id}
                    className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-sm"
                  >
                    <p className="font-bold text-slate-900">
                      السؤالُ 13 (إسنادُ «فتَحَ»): {latestAttempt.q13CorrectSubfields} من 9
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {q.entries.map((entry) => {
                        const res = evaluateConjugatedVerb(
                          tableAns[entry.pronounId] || '',
                          entry,
                          q.entries
                        );
                        if (res.status === 'exact') return null;
                        return (
                          <div
                            key={entry.pronounId}
                            className="rounded-lg border border-amber-200 bg-white p-2 text-xs"
                          >
                            <strong>{entry.pronounLabel}:</strong> كتبتَ «
                            {tableAns[entry.pronounId] || '—'}» · الصحيحُ:{' '}
                            <span className="font-bold text-emerald-700">
                              {entry.validForms[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
