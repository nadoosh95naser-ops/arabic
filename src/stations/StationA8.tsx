import React, { useState } from 'react';
import { BookOpenCheck, CheckCircle2, Eye, Save } from 'lucide-react';
import { A8_RUBRIC_ROWS, ASSETS } from '../data/curriculum';
import { PerformanceTaskState, VerbType } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { GuideBanner } from '../components/GuideBanner';
import { StationChecklist } from '../components/StationChecklist';
import { sanitizeUserText } from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationA8Props {
  state: PerformanceTaskState;
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: PerformanceTaskState) => void;
  onComplete: () => void;
}

export const StationA8: React.FC<StationA8Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [showGuideExample, setShowGuideExample] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const rubricTotal = Object.values(state.rubricScores).reduce<number>(
    (acc, val) => acc + (val ?? 0),
    0
  );
  const allRubricSelected = Object.values(state.rubricScores).every((v) => v !== null);
  const noZeroInCoreTenses =
    state.rubricScores.past !== 0 &&
    state.rubricScores.present !== 0 &&
    state.rubricScores.imperative !== 0;

  const sanitizeTask = (): PerformanceTaskState => ({
    ...state,
    pastSentence1: sanitizeUserText(state.pastSentence1),
    pastSentence2: sanitizeUserText(state.pastSentence2),
    presentNowSentence: sanitizeUserText(state.presentNowSentence),
    presentTomorrowSentence: sanitizeUserText(state.presentTomorrowSentence),
    imperativeSentence1: sanitizeUserText(state.imperativeSentence1),
    imperativeSentence2: sanitizeUserText(state.imperativeSentence2),
    extractedVerbs: state.extractedVerbs.map((item) => ({
      verb: sanitizeUserText(item.verb),
      type: item.type,
    })),
    chosenSentenceForExplanation: sanitizeUserText(state.chosenSentenceForExplanation),
    contextExplanation: sanitizeUserText(state.contextExplanation),
  });

  const handleSaveDraft = () => {
    const cleaned = sanitizeTask();
    audioManager.playTone('step');
    setNotice('تمَّ حفظُ البطاقةِ كمسوّدةٍ، ويمكنُكَ استكمالُها في أيِّ وقتٍ.');
    onUpdate({
      ...cleaned,
      status: 'draft',
      savedAt: Date.now(),
    });
  };

  const handleSaveFinal = () => {
    const cleaned = sanitizeTask();
    const hasAllSentences =
      cleaned.pastSentence1 &&
      cleaned.pastSentence2 &&
      cleaned.presentNowSentence &&
      cleaned.presentTomorrowSentence &&
      cleaned.imperativeSentence1 &&
      cleaned.imperativeSentence2;

    const hasAllVerbs = cleaned.extractedVerbs.every((v) => v.verb && v.type);

    if (!hasAllSentences) {
      setNotice('أكملْ كتابةَ الجملِ الستِّ في المجموعاتِ الثلاثِ قبلَ الحفظِ النهائيِّ.');
      return;
    }
    if (!hasAllVerbs) {
      setNotice('حدّدِ الأفعالَ الستةَ وصنّفْ كلَّ فعلٍ إلى ماضٍ أو مضارعٍ أو أمرٍ.');
      return;
    }
    if (!cleaned.chosenSentenceForExplanation || !cleaned.contextExplanation) {
      setNotice('اخترْ جملةً واحدةً واشرحْ كيفَ ساعدكَ السياقُ أو القرينةُ على اختيارِ الفعلِ.');
      return;
    }
    if (!allRubricSelected) {
      setNotice('أكملْ مراجعةَ عملِكَ الذاتيةَ في جدولِ الروبركِ الخماسيِّ.');
      return;
    }

    audioManager.playTone('success');
    setNotice(null);
    onUpdate({
      ...cleaned,
      status: 'completed',
      savedAt: Date.now(),
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="المهمةُ الأدائيةُ التكامليةُ (A8) · نجهّزُ ركنَ القراءةِ"
        message="أوشكتَ على إتمامِ مهمتِكَ المركزيةِ! أعدّ بطاقةَ عملِ فريقِكَ لتنظيمِ ركنِ القراءةِ، ثمَّ راجعْها ذاتياً وفقَ الروبركِ."
        audioId="a8_intro"
        muted={muted}
      />

      {/* Reading Corner Visual + Optional Guiding Example */}
      <section className="grid grid-cols-1 items-stretch gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-12 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-6">
          <SceneImage
            src={ASSETS.readingCornerProject}
            alt="ركنُ قراءةٍ مدرسيٌّ جاهزٌ للتنظيمِ معَ فريقِ الطلابِ"
            fallbackTitle="مشروعُ ركنِ القراءةِ"
            className="h-64 w-full lg:h-full"
          />
        </div>
        <div className="flex flex-col justify-between space-y-4 lg:col-span-6">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-slate-900">
              بطاقةُ عملِ فريقِ ركنِ القراءةِ
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              تتضمنُ بطاقةُ العملِ ستَّ جملٍ من إنشائِكَ: جملتينِ بالماضي عما أنجزهُ الفريقُ، وجملتينِ
              بالمضارعِ (واحدةٌ للحاضرِ «الآنَ» وأخرى للمستقبلِ «غداً»)، وجملتينِ بفعلِ الأمرِ لتوجيهِ
              الفريقِ.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowGuideExample((v) => !v)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-100"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>
                {showGuideExample ? 'إخفاءُ المثالِ الاسترشاديِّ' : 'عرضُ مثالٍ استرشاديٍّ غيرِ حصريٍّ'}
              </span>
            </button>

            {showGuideExample && (
              <div className="mt-3 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
                <p>
                  <strong className="text-amber-800">الماضي:</strong> جمعَ الطلابُ القصصَ، ورتّبوا
                  الكتبَ على الرفوفِ.
                </p>
                <p>
                  <strong className="text-sky-800">المضارعُ:</strong> يصنّفُ الفريقُ القصصَ الآنَ،
                  ويستقبلُ الزوّارَ غداً.
                </p>
                <p>
                  <strong className="text-emerald-800">الأمرُ:</strong> ضعوا الكتبَ في الرفوفِ،
                  واكتبوا أسماءَ القصصِ.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Groups 1, 2, 3 */}
      <section id="a8-sentences" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          أولاً: كتابةُ جملِ بطاقةِ العملِ
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Group 1: Past */}
          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <h3 className="font-display text-base font-bold text-amber-950">
              المجموعةُ الأولى – الماضي
            </h3>
            <p className="text-xs text-slate-600">اكتبْ جملتينِ تُخبرانِ عمّا أنجزهُ الفريقُ بالفعلِ.</p>
            <input
              type="text"
              dir="rtl"
              value={state.pastSentence1}
              onChange={(e) => onUpdate({ ...state, pastSentence1: e.target.value })}
              placeholder="الجملةُ الماضيةُ الأولى..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              type="text"
              dir="rtl"
              value={state.pastSentence2}
              onChange={(e) => onUpdate({ ...state, pastSentence2: e.target.value })}
              placeholder="الجملةُ الماضيةُ الثانيةُ..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          {/* Group 2: Present (Now & Tomorrow) */}
          <div className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/40 p-4">
            <h3 className="font-display text-base font-bold text-sky-950">
              المجموعةُ الثانيةُ – المضارعُ
            </h3>
            <p className="text-xs text-slate-600">
              جملةٌ عمّا يفعلُهُ الفريقُ الآنَ، وجملةٌ عمّا سيفعلُهُ غداً بقرينةٍ واضحةٍ.
            </p>
            <input
              type="text"
              dir="rtl"
              value={state.presentNowSentence}
              onChange={(e) => onUpdate({ ...state, presentNowSentence: e.target.value })}
              placeholder="جملةٌ مضارعةٌ للحاضرِ (الآنَ)..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              type="text"
              dir="rtl"
              value={state.presentTomorrowSentence}
              onChange={(e) => onUpdate({ ...state, presentTomorrowSentence: e.target.value })}
              placeholder="جملةٌ مضارعةٌ للمستقبلِ (غداً)..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          {/* Group 3: Imperative */}
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <h3 className="font-display text-base font-bold text-emerald-950">
              المجموعةُ الثالثةُ – الأمرُ
            </h3>
            <p className="text-xs text-slate-600">
              اكتبْ جملتينِ توجّهُ فيهما تعليماتٍ إلى أفرادِ الفريقِ بفعلَي أمرٍ مناسبينِ.
            </p>
            <input
              type="text"
              dir="rtl"
              value={state.imperativeSentence1}
              onChange={(e) => onUpdate({ ...state, imperativeSentence1: e.target.value })}
              placeholder="جملةُ الأمرِ الأولى..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              type="text"
              dir="rtl"
              value={state.imperativeSentence2}
              onChange={(e) => onUpdate({ ...state, imperativeSentence2: e.target.value })}
              placeholder="جملةُ الأمرِ الثانيةُ..."
              className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Steps 1, 2, 3: Extract, Classify & Explain */}
      <section id="a8-extract" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          ثانياً: حدّدِ الأفعالَ الستةَ وصنّفْها واشرحْ اختيارَكَ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.extractedVerbs.map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <label
                htmlFor={`a8-verb-${idx}`}
                className="block text-xs font-bold text-slate-600"
              >
                الفعلُ {idx + 1} من بطاقتِكَ
              </label>
              <input
                id={`a8-verb-${idx}`}
                type="text"
                dir="rtl"
                value={item.verb}
                onChange={(e) => {
                  const next = [...state.extractedVerbs];
                  next[idx] = { ...next[idx], verb: e.target.value };
                  onUpdate({ ...state, extractedVerbs: next });
                }}
                placeholder="اكتبِ الفعلَ..."
                className="min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
              />
              <div className="flex gap-1.5">
                {(
                  [
                    { id: 'past', label: 'ماضٍ' },
                    { id: 'present', label: 'مضارعٌ' },
                    { id: 'imperative', label: 'أمرٌ' },
                  ] as Array<{ id: VerbType; label: string }>
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      const next = [...state.extractedVerbs];
                      next[idx] = { ...next[idx], type: t.id };
                      onUpdate({ ...state, extractedVerbs: next });
                    }}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-bold ${
                      item.type === t.id
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="a8-chosen-sentence"
              className="block text-sm font-bold text-slate-800"
            >
              اخترْ جملةً واحدةً من بطاقتِكَ:
            </label>
            <input
              id="a8-chosen-sentence"
              type="text"
              dir="rtl"
              value={state.chosenSentenceForExplanation}
              onChange={(e) =>
                onUpdate({ ...state, chosenSentenceForExplanation: e.target.value })
              }
              placeholder="انسخْ أو اكتبِ الجملةَ المختارةَ..."
              className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="a8-explanation" className="block text-sm font-bold text-slate-800">
              اشرحْ كيفَ ساعدَكَ السياقُ أو القرينةُ على اختيارِ صيغةِ الفعلِ:
            </label>
            <input
              id="a8-explanation"
              type="text"
              dir="rtl"
              value={state.contextExplanation}
              onChange={(e) => onUpdate({ ...state, contextExplanation: e.target.value })}
              placeholder="مثالٌ: كلمةُ «غداً» دلّتْ على المستقبلِ..."
              className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Self-Review Rubric (10 points, strictly self-assessed) */}
      <section id="a8-rubric" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              ثالثاً: روبركُ المراجعةِ الذاتيةِ (10 درجاتٍ)
            </h2>
            <p className="text-sm text-slate-600">
              راجعْ عملَكَ بنفسِكَ لكلِّ معيارٍ. المعيارُ التصميميُّ الأوليُّ هو 7/10 دونَ الحصولِ على
              صفرٍ في الماضي أو المضارعِ أو الأمرِ.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 tabular-nums">
            تقييمُكَ الذاتيُّ: {rubricTotal} / 10
          </div>
        </div>

        <div className="space-y-3">
          {A8_RUBRIC_ROWS.map((row) => {
            const currentVal = state.rubricScores[row.key];
            return (
              <div
                key={row.key}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-display text-base font-bold text-slate-900">{row.title}</p>
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {row.levels.map((lvl) => {
                    const checked = currentVal === lvl.score;
                    return (
                      <button
                        key={lvl.score}
                        type="button"
                        onClick={() =>
                          onUpdate({
                            ...state,
                            rubricScores: { ...state.rubricScores, [row.key]: lvl.score },
                          })
                        }
                        className={`flex min-h-[54px] flex-col items-start justify-center rounded-xl border p-3 text-right transition-colors ${
                          checked
                            ? 'border-teal-600 bg-teal-50 text-teal-950'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-extrabold tabular-nums">
                          {lvl.score} {lvl.score === 2 ? 'درجتانِ' : lvl.score === 1 ? 'درجةٌ' : 'صفرٌ'}
                        </span>
                        <span className="mt-0.5 text-xs">{lvl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {allRubricSelected && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            {rubricTotal >= 7 && noZeroInCoreTenses ? (
              <p className="font-bold text-emerald-700">
                رائع! تقييمُكَ الذاتيُّ ({rubricTotal}/10) يحقّقُ المعيارَ المطلوبَ في الأزمنةِ الثلاثةِ.
              </p>
            ) : (
              <p className="font-medium text-amber-800">
                يمكنُكَ تحسينُ البطاقةِ في البنودِ التي حصلتَ فيها على 0 أو 1 قبلَ الحفظِ النهائيِّ.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Save Draft / Final & Continue */}
      <div id="a8-save" className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>حفظٌ كمسوّدةٍ</span>
          </button>
          <button
            type="button"
            onClick={handleSaveFinal}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
            <span>احفظِ البطاقةَ النهائيةَ</span>
          </button>
        </div>

        {state.status === 'completed' && (
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            الحالةُ: البطاقةُ النهائيةُ مكتملةٌ ومحفوظةٌ!
          </p>
        )}
        {notice && <p className="text-sm font-medium text-amber-800">{notice}</p>}
      </div>

      <StationChecklist
        requirements={[
          {
            id: 'sentences',
            label: '1. كتابةُ الجملِ الستِّ في المجموعاتِ الثلاثِ',
            done:
              Boolean(
                sanitizeUserText(state.pastSentence1) &&
                  sanitizeUserText(state.pastSentence2) &&
                  sanitizeUserText(state.presentNowSentence) &&
                  sanitizeUserText(state.presentTomorrowSentence) &&
                  sanitizeUserText(state.imperativeSentence1) &&
                  sanitizeUserText(state.imperativeSentence2)
              ) || isCompleted,
            targetSectionId: 'a8-sentences',
          },
          {
            id: 'extract',
            label: '2. استخراجُ الأفعالِ الستةِ وتفسيرُ جملةٍ بالسياقِ',
            done:
              (state.extractedVerbs.every((v) => sanitizeUserText(v.verb) && v.type) &&
                Boolean(sanitizeUserText(state.chosenSentenceForExplanation)) &&
                Boolean(sanitizeUserText(state.contextExplanation))) ||
              isCompleted,
            targetSectionId: 'a8-extract',
          },
          {
            id: 'rubric',
            label: '3. إكمالُ روبركِ المراجعةِ الذاتيةِ (5 معاييرَ)',
            done: allRubricSelected || isCompleted,
            targetSectionId: 'a8-rubric',
          },
          {
            id: 'final-save',
            label: '4. الضغطُ على «احفظِ البطاقةَ النهائيةَ»',
            done: state.status === 'completed' || isCompleted,
            targetSectionId: 'a8-save',
          },
        ]}
        readyMessage="أكملتَ المهمةَ الأدائيةَ لركنِ القراءةِ بنجاحٍ! انتقلْ الآنَ لعرضِ ملفِّ مهاراتِكَ."
        notReadyMessage="أكملِ البنودَ الآتيةَ لعرضِ النتائجِ وملفِّ المهاراتِ:"
        nextButtonLabel="عرضُ النتائجِ وملفِّ المهاراتِ"
        canComplete={state.status === 'completed' || isCompleted}
        onComplete={onComplete}
      />
    </div>
  );
};
