import React, { useState } from 'react';
import { CheckCircle2, Search, Trash2, AlertCircle } from 'lucide-react';
import { A6_PARAGRAPH_TOKENS, A6_TARGET_VERBS } from '../data/curriculum';
import { StationChecklist } from '../components/StationChecklist';
import { LearningProgressState, VerbType } from '../types/learning';
import { GuideBanner } from '../components/GuideBanner';
import { AudioExplainButton } from '../components/AudioExplainButton';
import { audioManager } from '../utils/audio';

interface StationA6Props {
  state: LearningProgressState['a6'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a6']) => void;
  onComplete: () => void;
}

const COLUMN_META: Array<{ type: VerbType; title: string; badgeClass: string; boxClass: string }> = [
  {
    type: 'past',
    title: 'الفعلُ الماضي',
    badgeClass: 'text-amber-800',
    boxClass: 'border-amber-200 bg-amber-50/40',
  },
  {
    type: 'present',
    title: 'الفعلُ المضارعُ',
    badgeClass: 'text-sky-800',
    boxClass: 'border-sky-200 bg-sky-50/40',
  },
  {
    type: 'imperative',
    title: 'فعلُ الأمرِ',
    badgeClass: 'text-emerald-800',
    boxClass: 'border-emerald-200 bg-emerald-50/40',
  },
];

export const StationA6: React.FC<StationA6Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [wordNotice, setWordNotice] = useState<string | null>(null);

  const placedCount = Object.keys(state.placements).length;
  const allSixPlaced = placedCount === A6_TARGET_VERBS.length;

  const allCorrect =
    state.checked &&
    A6_TARGET_VERBS.every((v) => state.placements[v.id] === v.verbType);

  const selectedToken = A6_PARAGRAPH_TOKENS.find((t) => t.id === selectedTokenId) || null;

  const handleTokenClick = (tokenId: string) => {
    const token = A6_PARAGRAPH_TOKENS.find((t) => t.id === tokenId);
    if (!token) return;

    if (!token.isVerb) {
      audioManager.playTone('gentle');
      setSelectedTokenId(null);
      setWordNotice(
        `«${token.text}» ليسَتْ فعلاً: ${token.clueHint} ابحثْ عن كلمةٍ تدلُّ على حدثٍ أو طلبٍ.`
      );
      return;
    }

    audioManager.playTone('step');
    setWordNotice(null);
    setSelectedTokenId(tokenId);
  };

  const handlePlaceVerb = (verbType: VerbType) => {
    if (!selectedTokenId) return;
    audioManager.playTone('step');
    onUpdate({
      ...state,
      placements: { ...state.placements, [selectedTokenId]: verbType },
      checked: false,
    });
    setSelectedTokenId(null);
  };

  const handleRemoveVerb = (tokenId: string) => {
    const next = { ...state.placements };
    delete next[tokenId];
    onUpdate({
      ...state,
      placements: next,
      checked: false,
    });
  };

  const handleVerify = () => {
    if (!allSixPlaced) {
      setWordNotice('استخرجِ الأفعالَ الستةَ جميعَها وصنّفْها في الجدولِ أولاً.');
      return;
    }
    const ok = A6_TARGET_VERBS.every((v) => state.placements[v.id] === v.verbType);
    audioManager.playTone(ok ? 'success' : 'gentle');
    onUpdate({
      ...state,
      checked: true,
      attempts: state.attempts + 1,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="المحققُ اللغويُّ (A6) · مهمةُ كشفِ الأفعالِ"
        message="اقرأِ الفقرةَ بعنايةٍ، ثمَّ انقرْ على كلِّ فعلٍ منَ الأفعالِ الستةِ (فعلينِ ماضيينِ، وفعلينِ مضارعينِ، وفعلَي أمرٍ) وصنّفْهُ في العمودِ المناسبِ."
        audioId="a6_intro"
        muted={muted}
      />

      {/* Paragraph Reading & Word Picker */}
      <section id="a6-paragraph" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-slate-900">
              الفقرةُ القرائيةُ (اضغطْ على الأفعالِ الستةِ)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 tabular-nums">
              المُصنَّفةُ: {placedCount} من 6
            </span>
            <AudioExplainButton
              id="a6_paragraph"
              text="في صباحِ يومِ الخميسِ، جمعَ طلابُ الصفِّ الخامسِ القصصَ المصورةَ، ورتّبوا الكتبَ على الرفوفِ الخشبيةِ. والآنَ تقرأُ سلمى قصةً ممتعةً، ويرسمُ طارقٌ لوحةً جميلةً للركنِ. وهذهِ رسالةُ القائدِ إلى الفريقِ: يا أصدقاءُ، حافظوا على نظافةِ الكتبِ، واكتبْ يا كريمُ أسماءَ القصصِ على البطاقاتِ."
              muted={muted}
            />
          </div>
        </div>

        <div
          aria-label="الفقرة التفاعلية لاستخراج الأفعال"
          className="flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 leading-loose"
        >
          {A6_PARAGRAPH_TOKENS.map((tok) => {
            const placedType = state.placements[tok.id];
            const isSelected = selectedTokenId === tok.id;
            return (
              <button
                key={tok.id}
                type="button"
                onClick={() => handleTokenClick(tok.id)}
                className={`rounded-lg px-2 py-1 font-display text-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 ${
                  isSelected
                    ? 'bg-teal-600 font-bold text-white ring-2 ring-teal-300'
                    : placedType === 'past'
                      ? 'border border-amber-400 bg-amber-100 font-bold text-amber-950'
                      : placedType === 'present'
                        ? 'border border-sky-400 bg-sky-100 font-bold text-sky-950'
                        : placedType === 'imperative'
                          ? 'border border-emerald-400 bg-emerald-100 font-bold text-emerald-950'
                          : 'text-slate-900 hover:bg-white hover:text-teal-800'
                }`}
              >
                {tok.text}
              </button>
            );
          })}
        </div>

        {/* Selected Verb Classification Controls */}
        {selectedToken && (
          <div className="flex flex-col gap-3 rounded-xl border border-teal-300 bg-teal-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-base font-bold text-teal-950">
              اخترتَ الفعلَ «{selectedToken.text}» — في أيِّ عمودٍ تضعُهُ؟
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePlaceVerb('past')}
                className="min-h-[42px] rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-100"
              >
                الفعلُ الماضي
              </button>
              <button
                type="button"
                onClick={() => handlePlaceVerb('present')}
                className="min-h-[42px] rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-950 hover:bg-sky-100"
              >
                الفعلُ المضارعُ
              </button>
              <button
                type="button"
                onClick={() => handlePlaceVerb('imperative')}
                className="min-h-[42px] rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-100"
              >
                فعلُ الأمرِ
              </button>
            </div>
          </div>
        )}

        {wordNotice && (
          <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3.5 text-sm text-sky-950">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
            <p>{wordNotice}</p>
          </div>
        )}
      </section>

      {/* 3-Column Classification Table */}
      <section id="a6-table" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          جدولُ تصنيفِ الأفعالِ المستخرجةِ
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMN_META.map((col) => {
            const items = A6_TARGET_VERBS.filter((v) => state.placements[v.id] === col.type);
            return (
              <div
                key={col.type}
                className={`space-y-3 rounded-2xl border p-4 ${col.boxClass}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-display text-base font-bold ${col.badgeClass}`}>
                    {col.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-600 tabular-nums">
                    ({items.length} / 2)
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 text-center text-xs text-slate-500">
                    لم تُضفْ أفعالاً هنا بعدُ
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((tok) => {
                      const isWrong = state.checked && tok.verbType !== col.type;
                      const isRight = state.checked && tok.verbType === col.type;
                      return (
                        <li
                          key={tok.id}
                          className={`space-y-1.5 rounded-xl border bg-white p-3 ${
                            isWrong
                              ? 'border-amber-400'
                              : isRight
                                ? 'border-emerald-400'
                                : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-base font-bold text-slate-900">
                              {tok.text}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVerb(tok.id)}
                              aria-label={`إزالة ${tok.text} من الجدول`}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {isWrong && (
                            <p className="text-xs font-medium text-amber-800">{tok.clueHint}</p>
                          )}
                          {isRight && (
                            <p className="text-xs font-bold text-emerald-700">تصنيفٌ صحيحٌ ✓</p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleVerify}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ منَ التصنيفِ
          </button>
          {state.checked && (
            allCorrect ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                رائع يا محقق! استخرجتَ الأفعالَ الستةَ وصنّفتَها بدقةٍ كاملةٍ.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                بعضُ الأفعالِ في غيرِ عمودِها الصحيحِ؛ اقرأِ التلميحَ تحتَ الفعلِ وأعدْ تصنيفَهُ.
              </span>
            )
          )}
        </div>
      </section>

      {/* Station Footer */}
      <StationChecklist
        requirements={[
          {
            id: 'extract',
            label: `استخراجُ الأفعالِ الستةِ (${placedCount}/6)`,
            done: allSixPlaced || isCompleted,
            targetSectionId: 'a6-paragraph',
          },
          {
            id: 'verify',
            label: 'تصنيفُها الصحيحُ والتحققُ في الجدولِ',
            done: allCorrect || isCompleted,
            targetSectionId: 'a6-table',
          },
        ]}
        readyMessage="أتممتَ مهمةَ المحققِ اللغويِّ! انتقلْ الآنَ إلى ورشةِ الجملِ."
        notReadyMessage="أكملِ البنودَ الآتيةَ للانتقالِ إلى ورشةِ الجملِ (A7):"
        nextButtonLabel="الانتقالُ إلى ورشةِ الجملِ (A7)"
        canComplete={allCorrect || isCompleted}
        onComplete={onComplete}
      />
    </div>
  );
};
