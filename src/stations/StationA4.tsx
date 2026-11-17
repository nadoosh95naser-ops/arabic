import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import {
  A4_CONVERSION_ITEMS,
  A4_NOW_OR_TOMORROW,
  A4_PRESENT_VERBS,
  ASSETS,
  NAATI_LETTERS,
} from '../data/curriculum';
import { LearningProgressState } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { GuideBanner } from '../components/GuideBanner';
import { AudioExplainButton } from '../components/AudioExplainButton';
import { ArabicVerbInput } from '../components/ArabicVerbInput';
import { StationChecklist } from '../components/StationChecklist';
import { stripAllDiacritics } from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationA4Props {
  state: LearningProgressState['a4'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a4']) => void;
  onComplete: () => void;
}

export const StationA4: React.FC<StationA4Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [sceneMode, setSceneMode] = useState<'now' | 'tomorrow'>('now');
  const [selectedNaati, setSelectedNaati] = useState<string>(NAATI_LETTERS[0].letter);
  const [conceptHint, setConceptHint] = useState<string | null>(null);
  const [trapHint, setTrapHint] = useState<string | null>(null);
  const [conjFeedback, setConjFeedback] = useState<Record<string, boolean>>({});
  const [conjSummary, setConjSummary] = useState<string | null>(null);

  // 1. Concept Check
  const handleConceptCheck = () => {
    if (state.conceptAnswer === 'present_or_future') {
      audioManager.playTone('success');
      onUpdate({ ...state, conceptSolved: true });
      setConceptHint(null);
    } else {
      audioManager.playTone('gentle');
      setConceptHint(
        'انظرْ إلى الجملةِ الثانيةِ «يقرأُ خالدٌ غداً» — لقد تغيّرتِ القرينةُ إلى «غداً» وبقيَ الفعلُ المضارعُ نفسه!'
      );
    }
  };

  // 2. Naati Explorer + Noun Trap
  const handleExploreLetter = (letter: string) => {
    setSelectedNaati(letter);
    audioManager.playTone('step');
    if (!state.exploredLetters.includes(letter)) {
      onUpdate({ ...state, exploredLetters: [...state.exploredLetters, letter] });
    }
  };

  const handleTrapCheck = () => {
    if (state.letterTrapAnswer === 'naktub') {
      audioManager.playTone('success');
      onUpdate({ ...state, letterTrapSolved: true });
      setTrapHint(null);
    } else {
      audioManager.playTone('gentle');
      setTrapHint(
        'تذكّرْ: لا يكفي أن تبدأَ الكلمةُ بأحدِ حروفِ «نأتي»؛ «أحمدُ» و«تفاحٌ» و«يدٌ» أسماءٌ لا تدلُّ على حدثٍ مقترنٍ بزمنٍ!'
      );
    }
  };

  // 3. Conversion game check
  const allConversionsCorrect =
    state.conversionChecked &&
    A4_CONVERSION_ITEMS.every((item) => state.conversionAnswers[item.id] === item.correct);

  // 4. Present Conjugation for 5 verbs
  const activeVerb = A4_PRESENT_VERBS[state.conjugationVerbIndex] || A4_PRESENT_VERBS[0];
  const activeAnswers = state.conjugationAnswers[activeVerb.id] || {};

  const checkCurrentPresentVerb = () => {
    const statusMap: Record<string, boolean> = {};
    let correctCount = 0;

    activeVerb.entries.forEach((entry) => {
      const userVal = stripAllDiacritics(activeAnswers[entry.pronounId] || '');
      const ok = entry.validForms.some((f) => stripAllDiacritics(f) === userVal);
      statusMap[entry.pronounId] = ok;
      if (ok) correctCount += 1;
    });

    setConjFeedback(statusMap);
    const allOk = correctCount === activeVerb.entries.length;
    audioManager.playTone(allOk ? 'success' : 'gentle');

    if (allOk) {
      setConjSummary(`رائع! أتممتَ إسنادَ «${activeVerb.baseLabel}» بنجاحٍ (8/8).`);
      if (!state.conjugationCheckedVerbs.includes(activeVerb.id)) {
        onUpdate({
          ...state,
          conjugationCheckedVerbs: [...state.conjugationCheckedVerbs, activeVerb.id],
        });
      }
    } else {
      setConjSummary(
        `أحرزتَ ${correctCount} من ${activeVerb.entries.length}. راجعِ الملاحظاتِ عند الحقولِ غيرِ المكتملةِ (وتذكّرِ الهمزةَ في «أكتبُ / أقرأُ...» للضميرِ أنا).`
      );
    }
  };

  // 5. Now or Tomorrow check
  const allNowTomorrowCorrect =
    state.nowOrTomorrowChecked &&
    A4_NOW_OR_TOMORROW.every((item) => state.nowOrTomorrowAnswers[item.id] === item.correct);

  const canComplete =
    (state.conceptSolved &&
      state.exploredLetters.length === 4 &&
      state.letterTrapSolved &&
      allConversionsCorrect &&
      state.conjugationCheckedVerbs.length >= 2 &&
      allNowTomorrowCorrect) ||
    isCompleted;

  const activeNaatiData =
    NAATI_LETTERS.find((item) => item.letter === selectedNaati) || NAATI_LETTERS[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="الدرسُ الثاني (A4) · مدينةُ الآنَ وغداً (الفعلُ المضارعُ)"
        message="اكتشفْ متى يدلُّ الفعلُ المضارعُ على الحاضرِ ومتى يدلُّ على المستقبلِ، وتعرّفْ أحرفَ المضارعةِ «نأتي» في سياقِها الصحيحِ."
        audioId="a4_intro"
        muted={muted}
      />

      {/* 1. Concept Discovery */}
      <section id="a4-s1" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. اكتشافُ المفهومِ: الآنَ أمْ غداً؟
          </h2>
          <AudioExplainButton
            id="a4_concept"
            text="الفعل المضارع هو الفعل الذي يدل على حدث يقع في الزمن الحاضر أو المستقبل. القرينة الزمنية مثل الآن أو غداً هي التي تحدد الوقت بدقة."
            muted={muted}
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="overflow-hidden rounded-xl border border-sky-200 md:col-span-5">
            <SceneImage
              src={ASSETS.presentReading}
              alt="خالدٌ يقرأُ في ركنِ القراءةِ"
              fallbackTitle="مشهدُ مدينةِ الآنَ وغداً"
              className="h-56 w-full"
            />
          </div>

          <div className="space-y-4 md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSceneMode('now')}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                  sceneMode === 'now'
                    ? 'bg-sky-600 text-white'
                    : 'border border-sky-200 bg-sky-50 text-sky-900'
                }`}
              >
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>المشهدُ الأولُ: الآنَ</span>
              </button>
              <button
                type="button"
                onClick={() => setSceneMode('tomorrow')}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                  sceneMode === 'tomorrow'
                    ? 'bg-sky-600 text-white'
                    : 'border border-sky-200 bg-sky-50 text-sky-900'
                }`}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>المشهدُ الثاني: غداً</span>
              </button>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4">
              <p className="font-display text-2xl font-extrabold text-slate-900">
                «يقرأُ خالدٌ <span className="text-sky-700">{sceneMode === 'now' ? 'الآنَ' : 'غداً'}</span>.»
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {sceneMode === 'now'
                  ? 'هنا يدلُّ الفعلُ «يقرأُ» على الحاضرِ لوجودِ القرينةِ «الآنَ».'
                  : 'هنا يدلُّ الفعلُ «يقرأُ» على المستقبلِ لوجودِ القرينةِ «غداً».'}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-sm font-bold text-slate-900">
                هلْ يدلُّ الفعلُ المضارعُ دائماً على الحاضرِ فقطْ؟
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'always_now', label: 'نعم، يدلُّ على الحاضرِ فقطْ دائماً' },
                  {
                    id: 'present_or_future',
                    label: 'لا، قدْ يدلُّ على الحاضرِ أو المستقبلِ بحسبِ السياقِ والقرينةِ',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setConceptHint(null);
                      onUpdate({ ...state, conceptAnswer: opt.id });
                    }}
                    className={`min-h-[42px] rounded-xl border px-4 py-2 text-right text-sm font-bold ${
                      state.conceptAnswer === opt.id
                        ? 'border-sky-600 bg-sky-50 text-sky-950'
                        : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleConceptCheck}
                className="min-h-[42px] rounded-xl bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-700"
              >
                تحقّقْ
              </button>
              {state.conceptSolved && (
                <p className="text-sm font-bold text-emerald-700">
                  صحيح! السياقُ والقرينةُ الزمنيةُ يحدّدانِ دلالةَ المضارعِ على الحاضرِ أو المستقبلِ.
                </p>
              )}
              {conceptHint && <p className="text-sm font-medium text-amber-800">{conceptHint}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Naati Letters Explorer + Context Guard */}
      <section id="a4-s2" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              2. اكتشافُ أحرفِ المضارعةِ: كلمةُ «نأتي»
            </h2>
            <p className="text-sm text-slate-600">
              اضغطْ على كلِّ حرفٍ منَ الحروفِ الأربعةِ (ن – أ – ت – ي) لاكتشافِ مثالِهِ في جملةٍ.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-700 tabular-nums">
            المستكشفةُ: {state.exploredLetters.length} من 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:max-w-md">
          {NAATI_LETTERS.map((item) => {
            const active = selectedNaati === item.letter;
            const visited = state.exploredLetters.includes(item.letter);
            return (
              <button
                key={item.letter}
                type="button"
                onClick={() => handleExploreLetter(item.letter)}
                className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border font-display text-2xl font-extrabold transition-colors ${
                  active
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : visited
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white'
                }`}
              >
                <span>{item.letter}</span>
                <span className="text-[11px] font-medium">{item.pronoun}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
          <p className="font-display text-lg font-bold text-slate-900">
            «{activeNaatiData.exampleSentence}»
          </p>
          <p className="mt-1 text-sm text-slate-700">
            الفعلُ: <strong className="text-sky-800">{activeNaatiData.verb}</strong> —{' '}
            {activeNaatiData.note}
          </p>
        </div>

        {/* Crucial Rule: Starting with ن/أ/ت/ي is not enough */}
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="font-display text-base font-bold text-amber-950">
            انتبهْ! ليسَ كلُّ كلمةٍ تبدأُ بـ(ن، أ، ت، ي) فعلاً مضارعاً:
          </p>
          <p className="text-sm text-slate-700">
            اخترِ الكلمةَ التي هيَ <strong>فعلٌ مضارعٌ حقيقيٌّ</strong> يدلُّ على حدثٍ وزمنٍ في سياقِها:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ahmed', label: 'أحمدُ (اسمُ ولدٍ)' },
              { id: 'tuffah', label: 'تفاحٌ (اسمُ فاكهةٍ)' },
              { id: 'naktub', label: 'نكتبُ (حدثُ الكتابةِ)' },
              { id: 'yad', label: 'يدٌ (اسمُ عضوٍ)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTrapHint(null);
                  onUpdate({ ...state, letterTrapAnswer: opt.id });
                }}
                className={`min-h-[42px] rounded-xl border px-4 py-2 text-sm font-bold ${
                  state.letterTrapAnswer === opt.id
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-300 bg-white text-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleTrapCheck}
            className="min-h-[40px] rounded-xl bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ من فهمِ السياقِ
          </button>
          {state.letterTrapSolved && (
            <p className="text-sm font-bold text-emerald-700">
              أحسنت! نعرفُ الفعلَ المضارعَ من معناه المرتبطِ بالحدثِ والزمنِ في الجملةِ، وليسَ من
              الحرفِ الأولِ وحدَهُ.
            </p>
          )}
          {trapHint && <p className="text-sm font-medium text-amber-900">{trapHint}</p>}
        </div>
      </section>

      {/* 3. Verb Conversion Game (5 past -> present) */}
      <section id="a4-s3" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. لعبةُ تحويلِ الأفعالِ (منَ الماضي إلى المضارعِ)
          </h2>
          <p className="text-sm text-slate-600">
            حوّلِ الأفعالَ الماضيةَ الخمسةَ الآتيةَ إلى مضارعةٍ توافقُ الضميرَ المطلوبَ.
          </p>
        </div>

        <div className="space-y-3">
          {A4_CONVERSION_ITEMS.map((item) => {
            const selected = state.conversionAnswers[item.id];
            const isCorrect = selected === item.correct;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-display text-base font-bold text-slate-900">
                    الفعلُ الماضي: <span className="text-amber-700">{item.pastVerb}</span> · الضميرُ:{' '}
                    <span className="text-sky-700">{item.pronoun}</span>
                  </p>
                  {state.conversionChecked && (
                    <p
                      className={`text-xs font-medium ${
                        isCorrect ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {isCorrect ? `صحيح! ${item.hint}` : item.hint}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onUpdate({
                          ...state,
                          conversionAnswers: { ...state.conversionAnswers, [item.id]: opt },
                          conversionChecked: false,
                        })
                      }
                      className={`min-h-[40px] rounded-xl border px-4 py-2 font-display text-sm font-bold ${
                        selected === opt
                          ? 'border-sky-600 bg-sky-600 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onUpdate({ ...state, conversionChecked: true });
              const ok = A4_CONVERSION_ITEMS.every(
                (item) => state.conversionAnswers[item.id] === item.correct
              );
              audioManager.playTone(ok ? 'success' : 'gentle');
            }}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ منَ التحويلاتِ الخمسةِ
          </button>
          {state.conversionChecked && (
            <span
              className={`text-sm font-bold ${
                allConversionsCorrect ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {allConversionsCorrect
                ? 'أحسنت! جميعُ التحويلاتِ الخمسةِ صحيحةٌ.'
                : 'بعضُ التحويلاتِ تحتاجُ مراجعةً؛ انظرِ التلميحَ تحتَ كلِّ بندٍ.'}
            </span>
          )}
        </div>
      </section>

      {/* 4. Present Tense Conjugation Game (5 Verbs) */}
      <section id="a4-s4" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              4. لعبةُ إسنادِ المضارعِ (خمسةُ أفعالٍ)
            </h2>
            <p className="text-sm text-slate-600">
              أسندِ الأفعالَ إلى الضمائرِ المقررةِ (أنجزْ فعلينِ على الأقلِّ للانتقالِ، ويمكنُكَ
              التدرّبُ على الخمسةِ جميعِها).
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 tabular-nums">
            الأفعالُ المنجزةُ: {state.conjugationCheckedVerbs.length} من {A4_PRESENT_VERBS.length}
          </span>
        </div>

        {/* 5 Verb Tabs */}
        <div className="flex flex-wrap gap-2">
          {A4_PRESENT_VERBS.map((v, idx) => {
            const done = state.conjugationCheckedVerbs.includes(v.id);
            const active = state.conjugationVerbIndex === idx;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setConjFeedback({});
                  setConjSummary(null);
                  onUpdate({ ...state, conjugationVerbIndex: idx });
                }}
                className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-bold ${
                  active
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : done
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                }`}
              >
                {done && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>{v.baseLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Conjugation Grid for Active Verb */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {activeVerb.entries.map((entry) => {
            const val = activeAnswers[entry.pronounId] || '';
            const status = conjFeedback[entry.pronounId];
            const hasCheck = entry.pronounId in conjFeedback;

            return (
              <div
                key={entry.pronounId}
                className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-display font-bold text-slate-900">
                    الضميرُ: <span className="text-sky-700">{entry.pronounLabel}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    حرفُ المضارعةِ: <strong className="text-teal-700">{entry.prefixLetter}</strong>
                  </span>
                </div>

                <ArabicVerbInput
                  id={`a4-${activeVerb.id}-${entry.pronounId}`}
                  label={`${activeVerb.baseLabel} مع ${entry.pronounLabel}`}
                  value={val}
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
                  placeholder={`مثالٌ: ${entry.prefixLetter}${entry.stem}`}
                />

                {hasCheck && (
                  <p
                    className={`text-xs font-medium ${
                      status ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {status ? 'صحيحٌ ✓' : entry.suffixHint}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={checkCurrentPresentVerb}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ من إسنادِ «{activeVerb.baseLabel}»
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

      {/* 5. Now or Tomorrow Challenge */}
      <section id="a4-s5" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          5. تحدّي: الآنَ أمْ غداً؟
        </h2>

        <div className="space-y-3">
          {A4_NOW_OR_TOMORROW.map((item) => {
            const val = state.nowOrTomorrowAnswers[item.id];
            const ok = val === item.correct;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">{item.situation}</p>
                  <p className="font-display text-base font-bold text-slate-900">
                    {item.sentenceStart}
                  </p>
                  {state.nowOrTomorrowChecked && (
                    <p className={`text-xs font-medium ${ok ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {ok ? `صحيح! ${item.explanation}` : 'تأمّلِ الموقفَ: هلْ يحدثُ في هذهِ اللحظةِ أمْ في اليومِ التالي؟'}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...state,
                        nowOrTomorrowAnswers: { ...state.nowOrTomorrowAnswers, [item.id]: 'now' },
                        nowOrTomorrowChecked: false,
                      })
                    }
                    className={`min-h-[40px] rounded-xl border px-4 py-2 text-xs font-bold ${
                      val === 'now'
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    الآنَ
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...state,
                        nowOrTomorrowAnswers: {
                          ...state.nowOrTomorrowAnswers,
                          [item.id]: 'tomorrow',
                        },
                        nowOrTomorrowChecked: false,
                      })
                    }
                    className={`min-h-[40px] rounded-xl border px-4 py-2 text-xs font-bold ${
                      val === 'tomorrow'
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    غداً
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onUpdate({ ...state, nowOrTomorrowChecked: true });
              const ok = A4_NOW_OR_TOMORROW.every(
                (item) => state.nowOrTomorrowAnswers[item.id] === item.correct
              );
              audioManager.playTone(ok ? 'success' : 'gentle');
            }}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ منَ القرائنِ
          </button>
          {state.nowOrTomorrowChecked && (
            <span
              className={`text-sm font-bold ${
                allNowTomorrowCorrect ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {allNowTomorrowCorrect
                ? 'أحسنت! جميعُ القرائنِ صحيحةٌ.'
                : 'راجعِ الجملَ التي تحتاجُ تعديلاً أعلاه.'}
            </span>
          )}
        </div>
      </section>

      {/* Station Footer */}
      <StationChecklist
        requirements={[
          {
            id: 'concept',
            label: '1. اكتشافُ دلالةِ المضارعِ (الآنَ أمْ غداً)',
            done: state.conceptSolved || isCompleted,
            targetSectionId: 'a4-s1',
          },
          {
            id: 'naati',
            label: `2. أحرفُ المضارعةِ «نأتي» (${state.exploredLetters.length}/4) وفهمُ السياقِ`,
            done: (state.exploredLetters.length === 4 && state.letterTrapSolved) || isCompleted,
            targetSectionId: 'a4-s2',
          },
          {
            id: 'conv',
            label: '3. لعبةُ تحويلِ الأفعالِ الخمسةِ',
            done: allConversionsCorrect || isCompleted,
            targetSectionId: 'a4-s3',
          },
          {
            id: 'conj',
            label: `4. إسنادُ المضارعِ (${state.conjugationCheckedVerbs.length} من 2 مطلوبٍ على الأقلِّ)`,
            done: state.conjugationCheckedVerbs.length >= 2 || isCompleted,
            targetSectionId: 'a4-s4',
          },
          {
            id: 'nt',
            label: '5. تحدّي: الآنَ أمْ غداً؟',
            done: allNowTomorrowCorrect || isCompleted,
            targetSectionId: 'a4-s5',
          },
        ]}
        readyMessage="أتممتَ مدينةَ الآنَ وغداً بنجاحٍ! أنتَ مستعدٌّ لمدينةِ الطلباتِ الذكيةِ."
        notReadyMessage="أكملِ البنودَ الآتيةَ للانتقالِ إلى محطةِ فعلِ الأمرِ (A5):"
        nextButtonLabel="الانتقالُ إلى محطةِ فعلِ الأمرِ (A5)"
        canComplete={canComplete}
        onComplete={onComplete}
      />
    </div>
  );
};
