import React, { useState } from 'react';
import { CheckCircle2, Eye, HelpCircle } from 'lucide-react';
import { A1_OPTIONS, A1_QUESTIONS, ASSETS } from '../data/curriculum';
import { StationChecklist } from '../components/StationChecklist';
import { LearningProgressState } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { GuideBanner } from '../components/GuideBanner';
import { audioManager } from '../utils/audio';

interface StationA1Props {
  state: LearningProgressState['a1'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a1']) => void;
  onComplete: () => void;
}

export const StationA1: React.FC<StationA1Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [revealedObservation, setRevealedObservation] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<
    Record<string, { tone: 'success' | 'hint' | 'warning'; text: string; extraExample?: string }>
  >({});

  const allSolved = A1_QUESTIONS.every((q) => state.completedQuestions.includes(q.id));

  const handleSelectOption = (qId: string, optionId: string) => {
    onUpdate({
      ...state,
      answers: { ...state.answers, [qId]: optionId },
    });
  };

  const handleCheck = (q: (typeof A1_QUESTIONS)[number]) => {
    const selected = state.answers[q.id];
    if (!selected) {
      setFeedbackMap((prev) => ({
        ...prev,
        [q.id]: { tone: 'warning', text: 'اخترْ إجابةً واحدةً أولاً ثمَّ اضغطْ «تحقّقْ».' },
      }));
      return;
    }

    const attempts = (state.attempts[q.id] || 0) + 1;
    const nextAttempts = { ...state.attempts, [q.id]: attempts };

    if (selected === q.correctOption) {
      audioManager.playTone('success');
      const nextCompleted = state.completedQuestions.includes(q.id)
        ? state.completedQuestions
        : [...state.completedQuestions, q.id];
      onUpdate({
        ...state,
        attempts: nextAttempts,
        completedQuestions: nextCompleted,
      });
      setFeedbackMap((prev) => ({
        ...prev,
        [q.id]: { tone: 'success', text: q.successExplanation },
      }));
    } else {
      audioManager.playTone('gentle');
      onUpdate({
        ...state,
        attempts: nextAttempts,
      });
      if (attempts === 1) {
        setFeedbackMap((prev) => ({
          ...prev,
          [q.id]: { tone: 'hint', text: q.hint1 },
        }));
      } else if (attempts === 2) {
        setFeedbackMap((prev) => ({
          ...prev,
          [q.id]: { tone: 'hint', text: q.hint2 },
        }));
      } else {
        setFeedbackMap((prev) => ({
          ...prev,
          [q.id]: {
            tone: 'warning',
            text: `لنفكّرْ معاً خطوةً بخطوةٍ: الكلمةُ الدالةُ على الحدثِ هيَ «${q.eventWord}» والقرينةُ هيَ «${q.clueWord}». جرّبِ الاختيارَ المناسبَ الآنَ!`,
            extraExample: q.parallelExample,
          },
        }));
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="ذاكرةُ الأفعالِ (A1) · هل تستطيعُ اكتشافَ الحدثِ؟"
        message="هذهِ المحطةُ لتنشيطِ تفكيرِكَ واسترجاعِ خبرتِكَ السابقةِ حولَ الحدثِ والقرينةِ الزمنيةِ، وليستِ اختباراً."
        audioId="a1_intro"
        muted={muted}
      />

      {/* Scene + Core Observation */}
      <section className="grid grid-cols-1 items-stretch gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-12 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-5">
          <SceneImage
            src={ASSETS.pastLibrary}
            alt="طالبٌ يرتبُ الكتبَ على رفِّ المكتبةِ المدرسيةِ"
            fallbackTitle="مشهدُ ترتيبِ الكتبِ"
            className="h-64 w-full lg:h-full"
          />
        </div>

        <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
          <div className="space-y-3">
            <p className="text-xs font-bold text-teal-700">الخطوةُ الأولى · لاحظِ المشهدَ والجملةَ</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                «رتّبْنا الكتبَ أمسِ.»
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
              تأمّلْ هذهِ الجملةَ: ما الحدثُ الذي قامَ بهِ الطلابُ؟ وما الكلمةُ التي تدلُّ على الحدثِ؟ وما
              القرينةُ التي تساعدُنا على معرفةِ زمنِ حدوثِهِ؟
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setRevealedObservation((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-5 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-100"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>{revealedObservation ? 'إخفاءُ التحليلِ' : 'اكتشفْ تحليلَ الجملةِ'}</span>
            </button>

            {revealedObservation && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">الكلمةُ الدالةُ على الحدثِ</p>
                  <p className="mt-1 font-display text-lg font-bold text-teal-700">رتّبْنا</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">القرينةُ الزمنيةُ</p>
                  <p className="mt-1 font-display text-lg font-bold text-amber-700">أمسِ</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">الضميرُ المتصلُ</p>
                  <p className="mt-1 font-display text-lg font-bold text-sky-700">نا (نحن)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Worked Example */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold text-sky-700">مثالٌ محلولٌ للاسترشادِ</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-slate-900">
              «كتبَ الطالبُ الواجبَ أمسِ.»
            </p>
            <p className="mt-1 text-sm text-slate-600">
              الكلمةُ «كتبَ» تدلُّ على حدثِ الكتابةِ، والقرينةُ «أمسِ» تُظهرُ أنَّ الحدثَ وقعَ وانتهى قبلَ
              الآنَ.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 shrink-0">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            أمسِ (حدثٌ انتهى)
          </span>
        </div>
      </section>

      {/* 2 Interactive Questions */}
      <section id="a1-questions" className="space-y-5">
        <h2 className="font-display text-xl font-bold text-slate-900">
          الآنَ دورُكَ في الاكتشافِ (سؤالانِ تفاعليانِ):
        </h2>

        {A1_QUESTIONS.map((q, index) => {
          const selected = state.answers[q.id] || '';
          const solved = state.completedQuestions.includes(q.id);
          const fb = feedbackMap[q.id];

          return (
            <div
              key={q.id}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500">السؤالُ {index + 1} من 2</span>
                {solved && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    تمَّ الاكتشافُ
                  </span>
                )}
              </div>

              <p className="font-display text-xl font-bold text-slate-900">«{q.sentence}»</p>
              <p className="text-sm font-medium text-slate-700">{q.prompt}</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {A1_OPTIONS.map((opt) => {
                  const active = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`min-h-[48px] rounded-xl border px-4 py-3 text-right text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${
                        active
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCheck(q)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  <span>تحقّقْ</span>
                </button>
              </div>

              {fb && (
                <div
                  className={`rounded-xl border p-4 text-sm leading-relaxed ${
                    fb.tone === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                      : fb.tone === 'hint'
                        ? 'border-sky-200 bg-sky-50 text-sky-950'
                        : 'border-amber-200 bg-amber-50 text-amber-950'
                  }`}
                >
                  <p className="font-medium">{fb.text}</p>
                  {fb.extraExample && <p className="mt-2 font-bold">{fb.extraExample}</p>}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Station Footer Action */}
      <StationChecklist
        requirements={A1_QUESTIONS.map((q, i) => ({
          id: q.id,
          label: `السؤالُ التفاعليُّ ${i + 1}`,
          done: state.completedQuestions.includes(q.id) || isCompleted,
          targetSectionId: 'a1-questions',
        }))}
        readyMessage="أتممتَ تنشيطَ المعرفةِ بنجاحٍ! يمكنك الانتقالُ الآنَ إلى مختبرِ الزمنِ اللغويِّ."
        notReadyMessage="أجبْ عنِ السؤالينِ للانتقالِ إلى المحطةِ التاليةِ (مختبر الزمن اللغوي):"
        nextButtonLabel="الانتقالُ إلى مختبرِ الزمنِ اللغويِّ (A2)"
        canComplete={allSolved || isCompleted}
        onComplete={onComplete}
      />
    </div>
  );
};
