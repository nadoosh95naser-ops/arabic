import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  A5_IMPERATIVE_VERBS,
  A5_SITUATIONS,
  ASSETS,
} from '../data/curriculum';
import { LearningProgressState } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { GuideBanner } from '../components/GuideBanner';
import { AudioExplainButton } from '../components/AudioExplainButton';
import { ArabicVerbInput } from '../components/ArabicVerbInput';
import { StationChecklist } from '../components/StationChecklist';
import {
  evaluateConjugatedVerb,
  sanitizeUserText,
  VerbCheckResult,
} from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationA5Props {
  state: LearningProgressState['a5'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a5']) => void;
  onComplete: () => void;
}

export const StationA5: React.FC<StationA5Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [compareHint, setCompareHint] = useState<string | null>(null);
  const [conjResults, setConjResults] = useState<Record<string, VerbCheckResult>>({});
  const [conjSummary, setConjSummary] = useState<string | null>(null);
  const [leaderNotice, setLeaderNotice] = useState<string | null>(null);

  const handleCompareCheck = () => {
    if (state.compareAnswer === 'second_request') {
      audioManager.playTone('success');
      onUpdate({ ...state, compareSolved: true });
      setCompareHint(null);
    } else {
      audioManager.playTone('gentle');
      setCompareHint(
        'لاحظْ: في «يفتحُ الطالبُ البابَ» نُخبرُ عن عملٍ يقومُ بهِ الطالبُ، أمّا «افتحِ البابَ» فنطلبُ من المخاطَبِ أن يقومَ بالفتحِ.'
      );
    }
  };

  const allSituationsCorrect =
    state.situationsChecked &&
    A5_SITUATIONS.every((s) => state.situationsAnswers[s.id] === s.correct);

  const activeVerb =
    A5_IMPERATIVE_VERBS[state.conjugationVerbIndex] || A5_IMPERATIVE_VERBS[0];
  const activeAnswers = state.conjugationAnswers[activeVerb.id] || {};

  const checkImperativeTable = () => {
    const nextResults: Record<string, VerbCheckResult> = {};
    let exactCount = 0;

    activeVerb.entries.forEach((entry) => {
      const res = evaluateConjugatedVerb(
        activeAnswers[entry.pronounId] || '',
        entry,
        activeVerb.entries
      );
      nextResults[entry.pronounId] = res;
      if (res.status === 'exact') exactCount += 1;
    });

    setConjResults(nextResults);
    const allOk = exactCount === activeVerb.entries.length;
    audioManager.playTone(allOk ? 'success' : 'gentle');

    if (allOk) {
      setConjSummary(`أحسنت! أنجزتَ إسنادَ «${activeVerb.label}» بالكاملِ (5/5).`);
      if (!state.conjugationCheckedVerbs.includes(activeVerb.id)) {
        onUpdate({
          ...state,
          conjugationCheckedVerbs: [...state.conjugationCheckedVerbs, activeVerb.id],
        });
      }
    } else {
      setConjSummary(`أحرزتَ ${exactCount} من 5. راجعِ الملاحظاتِ عند الحقولِ التي تحتاجُ تصويباً.`);
    }
  };

  const handleSaveLeaderInstructions = () => {
    const line1 = sanitizeUserText(state.leaderInstructions[0] || '');
    const line2 = sanitizeUserText(state.leaderInstructions[1] || '');
    if (!line1 || !line2) {
      setLeaderNotice('اكتبْ تعليمينِ للفريقِ مستخدماً فعلَي أمرٍ مناسبينِ.');
      return;
    }
    if (!state.leaderSelfChecks.every(Boolean)) {
      setLeaderNotice('تحقّقْ من جميعِ بنودِ المراجعةِ الذاتيةِ قبلَ الحفظِ.');
      return;
    }
    audioManager.playTone('success');
    setLeaderNotice(null);
    onUpdate({
      ...state,
      leaderInstructions: [line1, line2],
      leaderSaved: true,
    });
  };

  const canComplete =
    (state.compareSolved &&
      allSituationsCorrect &&
      state.conjugationCheckedVerbs.length >= 2 &&
      state.leaderSaved) ||
    isCompleted;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="الدرسُ الثالثُ (A5) · مدينةُ الطلباتِ الذكيةِ (فعلُ الأمرِ)"
        message="في هذهِ المدينةِ نوجّهُ تعليماتٍ لطيفةً وواضحةً إلى المخاطَبينَ. تذكّرْ: فعلُ الأمرِ طلبٌ وتوجيهٌ، وليسَ حدثاً وقعَ وانتهى!"
        audioId="a5_intro"
        muted={muted}
      />

      {/* 1. Dialogue Discovery */}
      <section id="a5-s1" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. اكتشافُ فعلِ الأمرِ: الخبرُ والطلبُ
          </h2>
          <AudioExplainButton
            id="a5_dialogue"
            text="الطالب الأول: ماذا أفعل بالكتب؟ الطالب الثاني: رتّب الكتب على الرفوف. الفعل رتّب يدل على طلب حصول الفعل من المخاطب."
            muted={muted}
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="overflow-hidden rounded-xl border border-emerald-200 md:col-span-5">
            <SceneImage
              src={ASSETS.imperativeTeamwork}
              alt="طالبانِ يتحاورانِ حولَ ترتيبِ الكتبِ في ركنِ القراءةِ"
              fallbackTitle="حوارُ مدينةِ الطلباتِ الذكيةِ"
              className="h-56 w-full"
            />
          </div>

          <div className="space-y-4 md:col-span-7">
            <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-sm font-bold text-slate-800">
                الطالبُ الأولُ: «ماذا أفعلُ بالكتبِ؟»
              </p>
              <p className="font-display text-lg font-extrabold text-emerald-900">
                الطالبُ الثاني: «<span className="rounded bg-emerald-200 px-1.5">رتّبِ</span> الكتبَ
                على الرفوفِ.»
              </p>
              <p className="text-sm text-slate-700">
                فعلُ الأمرِ يدلُّ على <strong>طلبِ حصولِ الفعلِ</strong> منَ المخاطَبِ.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">
                قارنْ بينَ الجملتينِ:
              </p>
              <p className="text-sm text-slate-800">
                أ) يفتحُ الطالبُ البابَ. &nbsp;&nbsp;|&nbsp;&nbsp; ب) افتحِ البابَ.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  {
                    id: 'both_inform',
                    label: 'كلتاهما تُخبرُ عنْ حدثٍ يقعُ الآنَ.',
                  },
                  {
                    id: 'second_request',
                    label: 'الأولى خبرٌ يصفُ ما يفعلُهُ الطالبُ، والثانيةُ طلبٌ موجَّهٌ للمخاطبِ.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCompareHint(null);
                      onUpdate({ ...state, compareAnswer: opt.id });
                    }}
                    className={`min-h-[44px] rounded-xl border p-3 text-right text-xs font-bold sm:text-sm ${
                      state.compareAnswer === opt.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCompareCheck}
                className="min-h-[40px] rounded-xl bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-700"
              >
                تحقّقْ
              </button>
              {state.compareSolved && (
                <p className="text-sm font-bold text-emerald-700">
                  رائع! ميّزتَ بوضوحٍ بينَ الخبرِ (يفتحُ) والطلبِ الموجَّهِ للمخاطَبِ (افتحْ).
                </p>
              )}
              {compareHint && <p className="text-sm font-medium text-amber-800">{compareHint}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 2. What do you say? */}
      <section id="a5-s2" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          2. لعبةُ: ماذا تقولُ؟
        </h2>
        <div className="space-y-3">
          {A5_SITUATIONS.map((sit) => {
            const val = state.situationsAnswers[sit.id];
            const ok = val === sit.correct;
            return (
              <div
                key={sit.id}
                className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-bold text-slate-900">{sit.situation}</p>
                <div className="flex flex-wrap gap-2">
                  {sit.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onUpdate({
                          ...state,
                          situationsAnswers: { ...state.situationsAnswers, [sit.id]: opt },
                          situationsChecked: false,
                        })
                      }
                      className={`min-h-[42px] rounded-xl border px-4 py-2 text-sm font-bold ${
                        val === opt
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {state.situationsChecked && (
                  <p className={`text-xs font-medium ${ok ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {ok
                      ? `أحسنت! ${sit.explanation}`
                      : 'اخترِ الجملةَ التي تطلبُ فيها من المخاطَبِ القيامَ بالعملِ الآنَ وتناسبُ عددَهُ ونوعَهُ.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onUpdate({ ...state, situationsChecked: true });
              const ok = A5_SITUATIONS.every((s) => state.situationsAnswers[s.id] === s.correct);
              audioManager.playTone(ok ? 'success' : 'gentle');
            }}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ منَ المواقفِ
          </button>
          {state.situationsChecked && (
            <span
              className={`text-sm font-bold ${
                allSituationsCorrect ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {allSituationsCorrect
                ? 'ممتاز! اخترتَ فعلَ الأمرِ المناسبَ في كلِّ موقفٍ.'
                : 'بعضُ المواقفِ تحتاجُ مراجعةً؛ تأكّدْ من اختيارِ الأمرِ المناسبِ للمخاطَبِ.'}
            </span>
          )}
        </div>
      </section>

      {/* 3. Imperative Conjugation Lab (5 addressee pronouns) */}
      <section id="a5-s3" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              3. مختبرُ إسنادِ الأمرِ (ضمائرُ المخاطَبِ الخمسةُ)
            </h2>
            <p className="text-sm text-slate-600">
              أسندِ الفعلَ إلى ضمائرِ المخاطَبِ: أنتَ – أنتما – أنتم – أنتِ – أنتنّ. (أنجزْ فعلينِ على
              الأقلِّ للانتقالِ).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 tabular-nums">
            الأفعالُ المنجزةُ: {state.conjugationCheckedVerbs.length} من {A5_IMPERATIVE_VERBS.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {A5_IMPERATIVE_VERBS.map((v, idx) => {
            const done = state.conjugationCheckedVerbs.includes(v.id);
            const active = state.conjugationVerbIndex === idx;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setConjResults({});
                  setConjSummary(null);
                  onUpdate({ ...state, conjugationVerbIndex: idx });
                }}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-bold ${
                  active
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : done
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                {done && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeVerb.entries.map((entry) => {
            const res = conjResults[entry.pronounId];
            return (
              <div
                key={entry.pronounId}
                className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
              >
                <p className="font-display text-base font-bold text-slate-900">
                  المخاطَبُ: <span className="text-emerald-700">{entry.pronounLabel}</span>
                </p>
                <ArabicVerbInput
                  id={`a5-${activeVerb.id}-${entry.pronounId}`}
                  label={`إسناد ${activeVerb.label} إلى ${entry.pronounLabel}`}
                  value={activeAnswers[entry.pronounId] || ''}
                  onChange={(nextVal) =>
                    onUpdate({
                      ...state,
                      conjugationAnswers: {
                        ...state.conjugationAnswers,
                        [activeVerb.id]: {
                          ...activeAnswers,
                          [entry.pronounId]: nextVal,
                        },
                      },
                    })
                  }
                  placeholder="اكتبْ صيغةَ الأمرِ..."
                />
                {res && (
                  <p
                    className={`flex items-start gap-1.5 text-xs font-medium ${
                      res.status === 'exact' ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {res.status !== 'exact' && (
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{res.message}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={checkImperativeTable}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ من إسنادِ الأمرِ
          </button>
          {conjSummary && (
            <p
              className={`text-sm font-bold ${
                state.conjugationCheckedVerbs.includes(activeVerb.id)
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {conjSummary}
            </p>
          )}
        </div>
      </section>

      {/* 4. Team Leader Challenge */}
      <section id="a5-s4" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="overflow-hidden rounded-xl border border-slate-200 md:col-span-5">
            <SceneImage
              src={ASSETS.readingCornerProject}
              alt="فريقُ طلابٍ يستعدُّ لتنظيمِ ركنِ القراءةِ"
              fallbackTitle="فريقُ تنظيمِ المكتبةِ"
              className="h-52 w-full"
            />
          </div>
          <div className="space-y-3 md:col-span-7">
            <h2 className="font-display text-xl font-bold text-slate-900">
              4. تحدّي قائدِ الفريقِ
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              بصفتِكَ قائدَ فريقِ ركنِ القراءةِ، اكتبْ توجيهينِ لزملائِكَ مستخدماً أفعالَ الأمرِ.
              مثالٌ استرشاديٌّ: «ضعوا الكتبَ في الرفوفِ» – «اكتبوا أسماءَ القصصِ».
            </p>
            <input
              type="text"
              dir="rtl"
              value={state.leaderInstructions[0] || ''}
              onChange={(e) => {
                setLeaderNotice(null);
                onUpdate({
                  ...state,
                  leaderInstructions: [e.target.value, state.leaderInstructions[1] || ''],
                  leaderSaved: false,
                });
              }}
              placeholder="التوجيهُ الأولُ..."
              className="min-h-[44px] w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900"
            />
            <input
              type="text"
              dir="rtl"
              value={state.leaderInstructions[1] || ''}
              onChange={(e) => {
                setLeaderNotice(null);
                onUpdate({
                  ...state,
                  leaderInstructions: [state.leaderInstructions[0] || '', e.target.value],
                  leaderSaved: false,
                });
              }}
              placeholder="التوجيهُ الثاني..."
              className="min-h-[44px] w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-700">قائمةُ المراجعةِ الذاتيةِ للتوجيهاتِ:</p>
          {[
            'هلْ وجّهتُ طلباً واضحاً إلى المخاطَبينَ؟',
            'هلْ استخدمتُ فعلَ أمرٍ يطابقُ ضميرَ المخاطَبِ (مثل: أنتم ← ضعوا)؟',
            'هلْ تساعدُ التعليماتُ الفريقَ على تنظيمِ المكتبةِ؟',
          ].map((label, idx) => (
            <label key={idx} className="flex cursor-pointer items-center gap-3 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={Boolean(state.leaderSelfChecks[idx])}
                onChange={(e) => {
                  const next = [...state.leaderSelfChecks];
                  next[idx] = e.target.checked;
                  setLeaderNotice(null);
                  onUpdate({ ...state, leaderSelfChecks: next, leaderSaved: false });
                }}
                className="h-5 w-5 rounded border-slate-300 text-teal-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveLeaderInstructions}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            احفظْ توجيهاتِ الفريقِ
          </button>
          {state.leaderSaved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              تمَّ حفظُ توجيهاتِكَ بنجاحٍ!
            </span>
          ) : (
            (state.leaderInstructions.some((l) => l.trim()) ||
              state.leaderSelfChecks.some(Boolean)) && (
              <span className="text-xs font-bold text-amber-800">
                اضغطْ «احفظْ توجيهاتِ الفريقِ» بعدَ إتمامِ المراجعةِ الذاتيةِ.
              </span>
            )
          )}
        </div>
        {leaderNotice && <p className="text-sm font-medium text-amber-800">{leaderNotice}</p>}
      </section>

      {/* Station Footer */}
      <StationChecklist
        requirements={[
          {
            id: 'compare',
            label: '1. التمييزُ بينَ الخبرِ والطلبِ',
            done: state.compareSolved || isCompleted,
            targetSectionId: 'a5-s1',
          },
          {
            id: 'sit',
            label: '2. لعبةُ: ماذا تقولُ؟',
            done: allSituationsCorrect || isCompleted,
            targetSectionId: 'a5-s2',
          },
          {
            id: 'conj',
            label: `3. إسنادُ الأمرِ (${state.conjugationCheckedVerbs.length} من 2 مطلوبٍ على الأقلِّ)`,
            done: state.conjugationCheckedVerbs.length >= 2 || isCompleted,
            targetSectionId: 'a5-s3',
          },
          {
            id: 'leader',
            label: '4. حفظُ توجيهاتِ قائدِ الفريقِ',
            done: state.leaderSaved || isCompleted,
            targetSectionId: 'a5-s4',
          },
        ]}
        readyMessage="أتممتَ الدروسَ الثلاثةَ بنجاحٍ! الآنَ حانَ وقتُ دمجِها في «المحقق اللغوي»."
        notReadyMessage="أكملِ البنودَ الآتيةَ للانتقالِ إلى المحققِ اللغويِّ (A6):"
        nextButtonLabel="الانتقالُ إلى المحققِ اللغويِّ (A6)"
        canComplete={canComplete}
        onComplete={onComplete}
      />
    </div>
  );
};
