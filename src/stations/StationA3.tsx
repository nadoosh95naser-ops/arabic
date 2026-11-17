import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  PenLine,
  BookOpen,
  Library,
  Trees,
  AlertCircle,
} from 'lucide-react';
import {
  A3_HUNTER_SENTENCES,
  A3_INTRO_SCENES,
  PAST_REFERENCE_DARASA,
  SAMA_CONJUGATION,
  SHURB_CONJUGATION,
} from '../data/curriculum';
import { LearningProgressState } from '../types/learning';
import { GuideBanner } from '../components/GuideBanner';
import { AudioExplainButton } from '../components/AudioExplainButton';
import { ArabicVerbInput } from '../components/ArabicVerbInput';
import { StationChecklist } from '../components/StationChecklist';
import {
  ConjugationEntry,
  evaluateConjugatedVerb,
  sanitizeUserText,
  VerbCheckResult,
} from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationA3Props {
  state: LearningProgressState['a3'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a3']) => void;
  onComplete: () => void;
}

export const StationA3: React.FC<StationA3Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [introHint, setIntroHint] = useState<string | null>(null);
  const [activePracticeVerb, setActivePracticeVerb] = useState<'shurb' | 'sama'>('shurb');
  const [selectedPronounId, setSelectedPronounId] = useState<string>('ana');
  const [sentenceNotice, setSentenceNotice] = useState<string | null>(null);
  const [conjSummary, setConjSummary] = useState<{ verb: 'shurb' | 'sama'; score: number } | null>(
    null
  );

  // Derive conjugation results reactively when verified so returning to A3 preserves diagnostic feedback
  const conjResults = useMemo(() => {
    const compute = (verified: boolean, answers: Record<string, string>, entries: ConjugationEntry[]) => {
      if (!verified) return {} as Record<string, VerbCheckResult>;
      const map: Record<string, VerbCheckResult> = {};
      entries.forEach((entry) => {
        map[entry.pronounId] = evaluateConjugatedVerb(answers[entry.pronounId] || '', entry, entries);
      });
      return map;
    };
    return {
      shurb: compute(state.conjugation.shurbVerified, state.conjugation.shurbAnswers, SHURB_CONJUGATION),
      sama: compute(state.conjugation.samaVerified, state.conjugation.samaAnswers, SAMA_CONJUGATION),
    };
  }, [
    state.conjugation.shurbVerified,
    state.conjugation.shurbAnswers,
    state.conjugation.samaVerified,
    state.conjugation.samaAnswers,
  ]);

  const renderSceneIcon = (iconName: 'pen' | 'book' | 'books' | 'tree') => {
    switch (iconName) {
      case 'pen':
        return <PenLine className="h-5 w-5 text-amber-700" aria-hidden="true" />;
      case 'book':
        return <BookOpen className="h-5 w-5 text-amber-700" aria-hidden="true" />;
      case 'books':
        return <Library className="h-5 w-5 text-amber-700" aria-hidden="true" />;
      case 'tree':
        return <Trees className="h-5 w-5 text-amber-700" aria-hidden="true" />;
    }
  };

  // 1. Intro verbs click
  const handleIntroTokenClick = (sceneId: string, isVerb: boolean, word: string) => {
    if (isVerb) {
      audioManager.playTone('success');
      if (!state.clickedIntroVerbs.includes(sceneId)) {
        onUpdate({
          ...state,
          clickedIntroVerbs: [...state.clickedIntroVerbs, sceneId],
        });
      }
      setIntroHint(null);
    } else {
      audioManager.playTone('gentle');
      setIntroHint(
        `الكلمةُ «${word}» اسمٌ يدلُّ على شخصٍ أو شيءٍ، وليسَتِ الحدثَ نفسَهُ. ابحثْ عنِ الكلمةِ التي تدلُّ على ما حصلَ!`
      );
    }
  };

  // 3. Verb Hunter toggle
  const toggleHunterToken = (tokenId: string) => {
    const exists = state.hunterSelectedIds.includes(tokenId);
    const next = exists
      ? state.hunterSelectedIds.filter((id) => id !== tokenId)
      : [...state.hunterSelectedIds, tokenId];
    onUpdate({
      ...state,
      hunterSelectedIds: next,
      hunterChecked: false,
    });
  };

  const allHunterTokens = A3_HUNTER_SENTENCES.flatMap((s) => s.tokens);
  const expectedHunterIds = allHunterTokens.filter((t) => t.isPastVerb).map((t) => t.id);
  const hunterAllCorrect =
    state.hunterChecked &&
    expectedHunterIds.every((id) => state.hunterSelectedIds.includes(id)) &&
    state.hunterSelectedIds.every((id) => expectedHunterIds.includes(id));

  // 4. Conjugation Lab Evaluation
  const verifyVerbTable = (verbKey: 'shurb' | 'sama', entries: ConjugationEntry[]) => {
    const answers =
      verbKey === 'shurb' ? state.conjugation.shurbAnswers : state.conjugation.samaAnswers;

    let correctCount = 0;
    entries.forEach((entry) => {
      const res = evaluateConjugatedVerb(answers[entry.pronounId] || '', entry, entries);
      if (res.status === 'exact') {
        correctCount += 1;
      }
    });

    if (correctCount >= 8) {
      audioManager.playTone('success');
    } else {
      audioManager.playTone('gentle');
    }
    setConjSummary({ verb: verbKey, score: correctCount });

    onUpdate({
      ...state,
      conjugation: {
        ...state.conjugation,
        shurbVerified: verbKey === 'shurb' ? true : state.conjugation.shurbVerified,
        samaVerified: verbKey === 'sama' ? true : state.conjugation.samaVerified,
        shurbBestScore:
          verbKey === 'shurb'
            ? Math.max(state.conjugation.shurbBestScore, correctCount)
            : state.conjugation.shurbBestScore,
        samaBestScore:
          verbKey === 'sama'
            ? Math.max(state.conjugation.samaBestScore, correctCount)
            : state.conjugation.samaBestScore,
      },
    });
  };

  const currentEntries = activePracticeVerb === 'shurb' ? SHURB_CONJUGATION : SAMA_CONJUGATION;
  const currentAnswers =
    activePracticeVerb === 'shurb'
      ? state.conjugation.shurbAnswers
      : state.conjugation.samaAnswers;
  const currentResults = conjResults[activePracticeVerb];
  const activeEntry =
    currentEntries.find((e) => e.pronounId === selectedPronounId) || currentEntries[0];

  const handleConjugationInput = (pronounId: string, val: string) => {
    const nextConj =
      activePracticeVerb === 'shurb'
        ? {
            ...state.conjugation,
            shurbAnswers: { ...state.conjugation.shurbAnswers, [pronounId]: val },
          }
        : {
            ...state.conjugation,
            samaAnswers: { ...state.conjugation.samaAnswers, [pronounId]: val },
          };
    onUpdate({ ...state, conjugation: nextConj });
  };

  // 5. Free Sentence Save
  const handleSaveSentence = () => {
    const cleaned = sanitizeUserText(state.freeSentence);
    if (!cleaned || cleaned.split(' ').length < 2) {
      setSentenceNotice('اكتبْ جملةً مفيدةً من كلمتينِ على الأقلِّ تبدأُ بفعلٍ ماضٍ.');
      return;
    }
    if (!state.selfChecks.every(Boolean)) {
      setSentenceNotice('راجعْ عناصرَ قائمةِ المراجعةِ الذاتيةِ الثلاثةِ قبلَ الحفظِ.');
      return;
    }
    audioManager.playTone('success');
    setSentenceNotice(null);
    onUpdate({
      ...state,
      freeSentence: cleaned,
      sentenceSaved: true,
    });
  };

  const conjugationGoalMet =
    state.conjugation.shurbBestScore >= 8 && state.conjugation.samaBestScore >= 8;

  const canComplete =
    (state.clickedIntroVerbs.length === A3_INTRO_SCENES.length &&
      hunterAllCorrect &&
      conjugationGoalMet &&
      state.sentenceSaved) ||
    isCompleted;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="الدرسُ الأولُ (A3) · مملكةُ الأحداثِ التي وقعتْ (الفعلُ الماضي)"
        message="انقرْ على الأفعالِ في المشاهدِ، واكتشفِ القاعدةَ، ثمَّ تدربْ على إسنادِ الفعلِ الماضي إلى الضمائرِ التسعةِ."
        audioId="a3_intro"
        muted={muted}
      />

      {/* 1. Intro Scene */}
      <section id="a3-s1" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            1. المشهدُ الاستهلاليُّ: انقرْ على الفعلِ في كلِّ جملةٍ
          </h2>
          <span className="text-xs font-bold text-amber-800 tabular-nums">
            المكتشفةُ: {state.clickedIntroVerbs.length} من {A3_INTRO_SCENES.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {A3_INTRO_SCENES.map((scene) => {
            const discovered = state.clickedIntroVerbs.includes(scene.id);
            return (
              <div
                key={scene.id}
                className={`space-y-3 rounded-xl border p-4 transition-colors ${
                  discovered ? 'border-amber-300 bg-amber-50/60' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white">
                    {renderSceneIcon(scene.iconName)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {scene.sentenceParts.map((part, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleIntroTokenClick(scene.id, part.isVerb, part.text)}
                        className={`rounded-lg px-2.5 py-1.5 font-display text-lg font-bold transition-colors ${
                          discovered && part.isVerb
                            ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500'
                            : 'bg-white text-slate-900 border border-slate-200 hover:border-teal-400 hover:bg-teal-50'
                        }`}
                      >
                        {part.text}
                      </button>
                    ))}
                  </div>
                </div>
                {discovered && (
                  <p className="text-xs font-medium text-amber-900">
                    أحسنت! «{scene.verb}»: {scene.meaning}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {introHint && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
            {introHint}
          </div>
        )}
      </section>

      {/* 2. Rule Discovery Card */}
      <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-slate-900">
            2. القاعدةُ المستنتجةُ: ما الفعلُ الماضي؟
          </h2>
          <AudioExplainButton
            id="a3_rule"
            text="الفعل الماضي هو الفعل الذي يدل على حدث وقع وانتهى قبل زمن التكلم، مثل: كتبَ طفلٌ رسالةً، وقرأتْ طالبةٌ قصةً."
            muted={muted}
          />
        </div>

        <p className="rounded-xl border border-amber-200 bg-white p-4 font-display text-lg font-bold leading-relaxed text-slate-900 sm:text-xl">
          الفعلُ الماضي هو الفعلُ الذي يدلُّ على حدثٍ وقعَ وانتهى قبلَ زمنِ التكلمِ.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs font-bold text-amber-700">المثالُ الأولُ</p>
            <p className="mt-1 font-display text-lg font-bold text-slate-900">
              «<span className="text-amber-700 underline">حفظَ</span> طارقٌ النشيدَ.»
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs font-bold text-amber-700">المثالُ الثاني</p>
            <p className="mt-1 font-display text-lg font-bold text-slate-900">
              «<span className="text-amber-700 underline">قرأتْ</span> ليلى قصةً جميلةً.»
            </p>
          </div>
        </div>
      </section>

      {/* 3. Verb Hunter Game */}
      <section id="a3-s3" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            3. لعبةُ صائدِ الأفعالِ
          </h2>
          <p className="text-sm text-slate-600">
            تحتوي الجملُ الآتيةُ على أفعالٍ وأسماءٍ. انقرْ على <strong>الأفعالِ الماضيةِ</strong>{' '}
            فقطْ لاصطيادِها، ثمَّ تحقّقْ لتعرفَ التفسيرَ اللغويَّ لكلِّ كلمةٍ.
          </p>
        </div>

        <div className="space-y-3">
          {A3_HUNTER_SENTENCES.map((sent, sIdx) => (
            <div key={sent.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-bold text-slate-500">الجملةُ {sIdx + 1}:</p>
              <div className="flex flex-wrap gap-2">
                {sent.tokens.map((tok) => {
                  const selected = state.hunterSelectedIds.includes(tok.id);
                  return (
                    <button
                      key={tok.id}
                      type="button"
                      onClick={() => toggleHunterToken(tok.id)}
                      aria-pressed={selected}
                      className={`min-h-[42px] rounded-xl border px-4 py-2 font-display text-base font-bold transition-colors ${
                        selected
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-slate-300 bg-white text-slate-900 hover:border-teal-400'
                      }`}
                    >
                      {tok.word}
                    </button>
                  );
                })}
              </div>

              {state.hunterChecked && (
                <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">
                  {sent.tokens.map((tok) => {
                    const selected = state.hunterSelectedIds.includes(tok.id);
                    if (!selected && !tok.isPastVerb) return null;
                    const rightChoice = (selected && tok.isPastVerb) || (!selected && !tok.isPastVerb);
                    return (
                      <p
                        key={tok.id}
                        className={`text-xs font-medium ${
                          rightChoice ? 'text-emerald-800' : 'text-amber-900'
                        }`}
                      >
                        {tok.isPastVerb && !selected
                          ? `لم تخترْ «${tok.word}»: `
                          : selected && !tok.isPastVerb
                            ? `انتبه عند «${tok.word}»: `
                            : 'صحيح! '}
                        {tok.reason}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onUpdate({ ...state, hunterChecked: true });
              const ok =
                expectedHunterIds.every((id) => state.hunterSelectedIds.includes(id)) &&
                state.hunterSelectedIds.every((id) => expectedHunterIds.includes(id));
              audioManager.playTone(ok ? 'success' : 'gentle');
            }}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ من صيدِ الأفعالِ
          </button>
          {state.hunterChecked && (
            hunterAllCorrect ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                اصطدتَ جميعَ الأفعالِ الماضيةِ الثلاثةِ بنجاحٍ!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                يوجدُ خطأٌ أو نقصٌ في الصيدِ (المطلوبُ الأفعالُ الثلاثةُ فقطْ دونَ الأسماءِ)؛ راجعِ التوضيحاتِ أعلاه ثمَّ اضغطْ «تحقّقْ».
              </span>
            )
          )}
        </div>
      </section>

      {/* 4. Past Tense 9-Pronoun Conjugation Lab */}
      <section id="a3-s4" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            4. مختبرُ إسنادِ الفعلِ الماضي (الضمائرُ التسعةُ)
          </h2>
          <p className="text-sm text-slate-600">
            لاحظْ أوّلاً جدولَ إسنادِ الفعلِ «درَسَ»، ثمَّ تدرّبْ على إسنادِ الفعلينِ «شرِبَ»
            و«سمِعَ» بدقةٍ. الهدفُ تحقيقُ <strong>8 من 9</strong> صيغٍ صحيحةٍ على الأقلِّ في كلِّ فعلٍ.
          </p>
        </div>

        {/* Reference Table: درس */}
        <details open className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <summary className="cursor-pointer font-display text-base font-bold text-amber-950">
            المثالُ الاسترشاديُّ: إسنادُ الفعلِ «درَسَ» إلى الضمائرِ التسعةِ
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="border-b border-amber-200 text-amber-900">
                  <th className="py-2 px-3 font-bold">الضميرُ</th>
                  <th className="py-2 px-3 font-bold">صيغةُ الفعلِ</th>
                  <th className="py-2 px-3 font-bold">موضعُ التغيّرِ في آخرِهِ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {PAST_REFERENCE_DARASA.map((row) => (
                  <tr key={row.pronoun}>
                    <td className="py-2 px-3 font-bold text-slate-900">{row.pronoun}</td>
                    <td className="py-2 px-3 font-display text-base font-bold text-amber-800">
                      {row.form}
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      <span className="font-bold text-teal-800">{row.highlight}</span> · {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* Interactive Lab: شرب / سمع */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setActivePracticeVerb('shurb');
                  setSelectedPronounId('ana');
                  setConjSummary(null);
                }}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  activePracticeVerb === 'shurb'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {state.conjugation.shurbBestScore >= 8 && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                )}
                <span>الفعلُ: شرِبَ ({state.conjugation.shurbBestScore}/9)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePracticeVerb('sama');
                  setSelectedPronounId('ana');
                  setConjSummary(null);
                }}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  activePracticeVerb === 'sama'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {state.conjugation.samaBestScore >= 8 && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                )}
                <span>الفعلُ: سمِعَ ({state.conjugation.samaBestScore}/9)</span>
              </button>
            </div>

            <span className="text-xs font-bold text-slate-500">
              تذكّرْ: استخدمْ أزرارَ الحركاتِ المساعدةِ لتمييزِ تُ / تَ / تِ.
            </span>
          </div>

          {/* Interactive Pronoun Selector + Highlighted Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-5">
              <p className="text-xs font-bold text-slate-500">اخترِ الضميرَ لإدخالِ الصيغةِ:</p>
              <div className="grid grid-cols-3 gap-2">
                {currentEntries.map((entry) => {
                  const res = currentResults[entry.pronounId];
                  const hasValue = Boolean((currentAnswers[entry.pronounId] || '').trim());
                  const active = selectedPronounId === entry.pronounId;
                  return (
                    <button
                      key={entry.pronounId}
                      type="button"
                      onClick={() => setSelectedPronounId(entry.pronounId)}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                        active
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : res?.status === 'exact'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                            : res && res.status !== 'empty'
                              ? 'border-amber-300 bg-amber-50 text-amber-900'
                              : hasValue
                                ? 'border-sky-300 bg-sky-50 text-sky-900'
                                : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
                      }`}
                    >
                      {entry.pronounLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-7">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold text-slate-900">
                  الضميرُ المختارُ: <span className="text-teal-700">{activeEntry.pronounLabel}</span>
                </p>
                <span className="text-xs font-medium text-slate-500">
                  الفعلُ الأساسُ: {activePracticeVerb === 'shurb' ? 'شرِبَ' : 'سمِعَ'}
                </span>
              </div>

              <ArabicVerbInput
                id={`conj-${activePracticeVerb}-${activeEntry.pronounId}`}
                label={`صيغة الفعل للضمير ${activeEntry.pronounLabel}`}
                value={currentAnswers[activeEntry.pronounId] || ''}
                onChange={(val) => handleConjugationInput(activeEntry.pronounId, val)}
                placeholder={`اكتبْ إسنادَ «${activePracticeVerb === 'shurb' ? 'شرِبَ' : 'سمِعَ'}» مع «${activeEntry.pronounLabel}»`}
              />

              {currentResults[activeEntry.pronounId] && (
                <div
                  className={`flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed ${
                    currentResults[activeEntry.pronounId].status === 'exact'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-amber-200 bg-amber-50 text-amber-950'
                  }`}
                >
                  {currentResults[activeEntry.pronounId].status === 'exact' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  )}
                  <p>{currentResults[activeEntry.pronounId].message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Full 9-row Summary Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-right text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">الضميرُ</th>
                  <th className="py-2.5 px-3 font-bold">إجابتُكَ</th>
                  <th className="py-2.5 px-3 font-bold">الحالةُ والتلميحُ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentEntries.map((entry) => {
                  const ans = currentAnswers[entry.pronounId] || '';
                  const res = currentResults[entry.pronounId];
                  return (
                    <tr
                      key={entry.pronounId}
                      onClick={() => setSelectedPronounId(entry.pronounId)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">{entry.pronounLabel}</td>
                      <td className="py-2.5 px-3 font-display font-bold text-teal-800">
                        {ans || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-xs">
                        {!res ? (
                          <span className="text-slate-400">انقرْ للتعديلِ</span>
                        ) : res.status === 'exact' ? (
                          <span className="font-bold text-emerald-700">صحيحٌ ✓</span>
                        ) : (
                          <span className="font-medium text-amber-800">{res.message}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => verifyVerbTable(activePracticeVerb, currentEntries)}
              className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
            >
              تحقّقْ من جدولِ «{activePracticeVerb === 'shurb' ? 'شرِبَ' : 'سمِعَ'}» (9 ضمائرَ)
            </button>
            <p className="text-sm font-bold text-slate-700 tabular-nums">
              أفضلُ نتيجةٍ: شرِبَ ({state.conjugation.shurbBestScore}/9) · سمِعَ (
              {state.conjugation.samaBestScore}/9)
            </p>
          </div>

          {conjSummary && conjSummary.verb === activePracticeVerb && (
            <div
              className={`rounded-xl border p-3.5 text-sm font-bold ${
                conjSummary.score >= 8
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50 text-amber-950'
              }`}
            >
              {conjSummary.score >= 8
                ? `ممتاز! أحرزتَ ${conjSummary.score} من 9 في إسنادِ «${activePracticeVerb === 'shurb' ? 'شرِبَ' : 'سمِعَ'}».`
                : `أحرزتَ ${conjSummary.score} من 9 (المطلوبُ 8 على الأقلِّ). راجعِ التوضيحاتِ في الجدولِ أعلاه وتأكّدْ من وضعِ الضمّةِ مع «أنا»، والكسرةِ مع «أنتِ»، والفتحةِ مع «أنتَ».`}
            </div>
          )}

          {/* Clear next-tab prompt so student doesn't miss the other conjugation verb */}
          {activePracticeVerb === 'shurb' &&
            state.conjugation.shurbBestScore >= 8 &&
            state.conjugation.samaBestScore < 8 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm">
                <span className="font-bold text-emerald-900">
                  أحسنتَ في إسنادِ «شرِبَ»! بقيَ إسنادُ الفعلِ الثاني «سمِعَ» لتحقيقِ الهدفِ.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePracticeVerb('sama');
                    setSelectedPronounId('ana');
                    setConjSummary(null);
                  }}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  انتقلْ إلى إسنادِ «سمِعَ» ←
                </button>
              </div>
            )}
          {activePracticeVerb === 'sama' &&
            state.conjugation.samaBestScore >= 8 &&
            state.conjugation.shurbBestScore < 8 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm">
                <span className="font-bold text-emerald-900">
                  أحسنتَ في إسنادِ «سمِعَ»! بقيَ إسنادُ الفعلِ الأولِ «شرِبَ» لتحقيقِ الهدفِ.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePracticeVerb('shurb');
                    setSelectedPronounId('ana');
                    setConjSummary(null);
                  }}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  انتقلْ إلى إسنادِ «شرِبَ» ←
                </button>
              </div>
            )}
        </div>
      </section>

      {/* 5. Free Past Sentence Challenge */}
      <section id="a3-s5" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            5. تحدّي الجملةِ الماضيةِ
          </h2>
          <p className="text-sm text-slate-600">
            اكتبْ جملةً من اختيارِكَ تبدأُ بفعلٍ ماضٍ، ثمَّ راجعْها بنفسِكَ باستخدامِ قائمةِ المراجعةِ
            الذاتيةِ.
          </p>
        </div>

        <label htmlFor="a3-free-sentence" className="sr-only">
          جملتك بالفِعْلِ الماضي
        </label>
        <input
          id="a3-free-sentence"
          type="text"
          dir="rtl"
          value={state.freeSentence}
          onChange={(e) => {
            setSentenceNotice(null);
            onUpdate({ ...state, freeSentence: e.target.value, sentenceSaved: false });
          }}
          placeholder="مثالٌ استرشاديٌّ: شاركَ الطلابُ في ترتيبِ المكتبةِ..."
          className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30"
        />

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-700">قائمةُ المراجعةِ الذاتيةِ:</p>
          {[
            'هل يدلُّ الفعلُ على حدثٍ وقعَ وانتهى؟',
            'هل استخدمتُ فعلاً ماضياً في بدايةِ الجملةِ؟',
            'هل الجملةُ واضحةُ المعنى ومكتملةٌ؟',
          ].map((label, idx) => (
            <label
              key={idx}
              className="flex min-h-[36px] cursor-pointer items-center gap-3 text-sm text-slate-800"
            >
              <input
                type="checkbox"
                checked={Boolean(state.selfChecks[idx])}
                onChange={(e) => {
                  const nextChecks = [...state.selfChecks];
                  nextChecks[idx] = e.target.checked;
                  setSentenceNotice(null);
                  onUpdate({ ...state, selfChecks: nextChecks, sentenceSaved: false });
                }}
                className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveSentence}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            احفظْ جملتَكَ
          </button>
          {state.sentenceSaved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              تمَّ حفظُ جملتِكَ بنجاحٍ!
            </span>
          ) : (
            (state.freeSentence.trim() || state.selfChecks.some(Boolean)) && (
              <span className="text-xs font-bold text-amber-800">
                اضغطْ «احفظْ جملتَكَ» بعدَ إتمامِ المراجعةِ الذاتيةِ لاعتمادِها.
              </span>
            )
          )}
        </div>
        {sentenceNotice && <p className="text-sm font-medium text-amber-800">{sentenceNotice}</p>}
      </section>

      {/* Station Footer */}
      <StationChecklist
        requirements={[
          {
            id: 'intro',
            label: `1. المشهدُ الاستهلاليُّ (${state.clickedIntroVerbs.length}/${A3_INTRO_SCENES.length})`,
            done: state.clickedIntroVerbs.length === A3_INTRO_SCENES.length || isCompleted,
            targetSectionId: 'a3-s1',
          },
          {
            id: 'hunter',
            label: '3. لعبةُ صائدِ الأفعالِ',
            done: hunterAllCorrect || isCompleted,
            targetSectionId: 'a3-s3',
          },
          {
            id: 'shurb',
            label: `4. إسنادُ «شرِبَ» (${state.conjugation.shurbBestScore}/9 · المطلوبُ 8)`,
            done: state.conjugation.shurbBestScore >= 8 || isCompleted,
            targetSectionId: 'a3-s4',
          },
          {
            id: 'sama',
            label: `4. إسنادُ «سمِعَ» (${state.conjugation.samaBestScore}/9 · المطلوبُ 8)`,
            done: state.conjugation.samaBestScore >= 8 || isCompleted,
            targetSectionId: 'a3-s4',
          },
          {
            id: 'sentence',
            label: '5. حفظُ جملتِكَ الماضيةِ بعدَ المراجعةِ',
            done: state.sentenceSaved || isCompleted,
            targetSectionId: 'a3-s5',
          },
        ]}
        readyMessage="أحسنت! أتممتَ جميعَ متطلباتِ مملكةِ الفعلِ الماضي بنجاحٍ."
        notReadyMessage="أكملِ البنودَ الآتيةَ ليُفتحَ لكَ الانتقالُ إلى محطةِ الفعلِ المضارعِ (A4):"
        nextButtonLabel="الانتقالُ إلى محطةِ الفعلِ المضارعِ (A4)"
        canComplete={canComplete}
        onComplete={onComplete}
      />
    </div>
  );
};
