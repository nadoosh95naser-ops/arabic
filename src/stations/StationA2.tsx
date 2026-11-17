import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  MessageCircle,
  Calendar,
  History,
} from 'lucide-react';
import { A2_COMPARE_ITEMS, ASSETS } from '../data/curriculum';
import { LearningProgressState, VerbType } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { GuideBanner } from '../components/GuideBanner';
import { AudioExplainButton } from '../components/AudioExplainButton';
import { StationChecklist } from '../components/StationChecklist';
import { audioManager } from '../utils/audio';

interface StationA2Props {
  state: LearningProgressState['a2'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a2']) => void;
  onComplete: () => void;
}

export const StationA2: React.FC<StationA2Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [activePortal, setActivePortal] = useState<VerbType>(
    state.visitedPortals[state.visitedPortals.length - 1] || 'past'
  );
  const [compareChecked, setCompareChecked] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<{
    tone: 'success' | 'hint';
    text: string;
  } | null>(null);

  // Ensure the initially displayed portal ('past') counts as visited on load
  useEffect(() => {
    if (!state.visitedPortals.includes(activePortal)) {
      onUpdate({
        ...state,
        visitedPortals: [...state.visitedPortals, activePortal],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePortal]);

  const openPortal = (portal: VerbType) => {
    setActivePortal(portal);
    audioManager.playTone('step');
    if (!state.visitedPortals.includes(portal)) {
      onUpdate({
        ...state,
        visitedPortals: [...state.visitedPortals, portal],
      });
    }
  };

  const allPortalsVisited =
    state.visitedPortals.includes('past') &&
    state.visitedPortals.includes('present') &&
    state.visitedPortals.includes('imperative');

  const allCompareCorrect = A2_COMPARE_ITEMS.every(
    (item) => state.compareAnswers[item.id] === item.correctType
  );

  const handleCheckFinalQuestion = () => {
    if (!state.checkAnswer) {
      setCheckFeedback({ tone: 'hint', text: 'اخترْ إجابةً واحدةً أولاً.' });
      return;
    }
    if (state.checkAnswer === 'outside_timeline') {
      audioManager.playTone('success');
      onUpdate({ ...state, checkPassed: true });
      setCheckFeedback({
        tone: 'success',
        text: 'ممتاز! فعلُ الأمرِ لا يخبرُ عن حدثٍ وقعَ في الماضي أو يقعُ في المستقبلِ، بل هو طلبٌ موجَّهٌ إلى المخاطبِ.',
      });
    } else {
      audioManager.playTone('gentle');
      setCheckFeedback({
        tone: 'hint',
        text: 'تأمّل بوابةَ الأمرِ مرةً أخرى: هل كلمةُ «افتحْ» تخبرنا عن حدثٍ وقعَ بالفعلِ أم تطلبُ من المخاطبِ القيامَ بالعملِ؟',
      });
    }
  };

  const canFinishStation =
    (allPortalsVisited && allCompareCorrect && state.checkPassed) || isCompleted;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="مختبرُ الزمنِ اللغويِّ (A2) · بوابةُ الزمنِ"
        message="استكشفِ البواباتِ الثلاثَ لتكتشفَ موقعَ الحدثِ على خطِّ الزمنِ، ولماذا نضعُ فعلَ الأمرِ في مساحةِ الطلبِ لا على خطِّ الأحداثِ الواقعةِ."
        audioId="a2_intro"
        muted={muted}
      />

      {/* Interactive Timeline Diagram */}
      <section id="a2-portals" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900">
            خطُّ الزمنِ الإخباريُّ وبواباتُ الاكتشافِ
          </h2>
          <span className="text-xs font-bold text-slate-500">
            البواباتُ المستكشفةُ: {state.visitedPortals.length} من 3
          </span>
        </div>

        {/* Visual Timeline Bar */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Before Speech */}
            <div
              className={`rounded-xl border p-4 text-center transition-colors ${
                activePortal === 'past'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-xs font-bold text-amber-700">قبلَ لحظةِ التكلمِ</p>
              <p className="mt-1 font-display text-base font-bold text-slate-900">الزمنُ الماضي</p>
              <p className="mt-1 text-xs text-slate-600">حدثٌ وقعَ وانتهى (أمسِ)</p>
            </div>

            {/* Now Anchor */}
            <div
              className={`rounded-xl border p-4 text-center transition-colors ${
                activePortal === 'present' && state.presentTimeView === 'now'
                  ? 'border-sky-400 bg-sky-50'
                  : 'border-slate-300 bg-white'
              }`}
            >
              <p className="text-xs font-bold text-sky-700">نقطةُ الارتكازِ الثابتةُ</p>
              <p className="mt-1 font-display text-lg font-extrabold text-slate-900">
                الآنَ (لحظةُ التكلمِ)
              </p>
              <p className="mt-1 text-xs text-slate-600">حدثٌ يقعُ في الحاضرِ</p>
            </div>

            {/* After Speech */}
            <div
              className={`rounded-xl border p-4 text-center transition-colors ${
                activePortal === 'present' && state.presentTimeView === 'tomorrow'
                  ? 'border-sky-400 bg-sky-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-xs font-bold text-sky-700">بعدَ لحظةِ التكلمِ</p>
              <p className="mt-1 font-display text-base font-bold text-slate-900">المستقبلُ</p>
              <p className="mt-1 text-xs text-slate-600">حدثٌ متوقَّعٌ (غداً)</p>
            </div>
          </div>

          {/* Separate Zone for Imperative */}
          <div
            className={`mt-4 rounded-xl border border-dashed p-4 text-center transition-colors ${
              activePortal === 'imperative'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-emerald-300 bg-white'
            }`}
          >
            <p className="text-xs font-bold text-emerald-700">
              مساحةٌ مستقلةٌ عنْ خطِّ الإخبارِ الزمنيِّ
            </p>
            <p className="mt-1 font-display text-base font-bold text-slate-900">
              فعلُ الأمرِ · طلبٌ وتوجيهٌ إلى المخاطَبِ
            </p>
            <p className="mt-1 text-xs text-slate-600">
              لا يخبرُ عنْ حدثٍ وقعَ أو سيقعُ تلقائياً، بل يطلبُ من المخاطَبِ أنْ يفعلَ الشيءَ.
            </p>
          </div>
        </div>

        {/* 3 Interactive Portal Selector Buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => openPortal('past')}
            className={`flex min-h-[52px] items-center justify-between rounded-xl border px-4 py-3 text-right font-bold transition-colors ${
              activePortal === 'past'
                ? 'border-amber-500 bg-amber-50 text-amber-950'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <History className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <span>البوابةُ الأولى: الماضي</span>
            </span>
            {state.visitedPortals.includes('past') && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="تمّت زيارتها" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openPortal('present')}
            className={`flex min-h-[52px] items-center justify-between rounded-xl border px-4 py-3 text-right font-bold transition-colors ${
              activePortal === 'present'
                ? 'border-sky-500 bg-sky-50 text-sky-950'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <span>البوابةُ الثانية: المضارعُ</span>
            </span>
            {state.visitedPortals.includes('present') && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="تمّت زيارتها" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openPortal('imperative')}
            className={`flex min-h-[52px] items-center justify-between rounded-xl border px-4 py-3 text-right font-bold transition-colors ${
              activePortal === 'imperative'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <span>البوابةُ الثالثة: الأمرُ</span>
            </span>
            {state.visitedPortals.includes('imperative') && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="تمّت زيارتها" />
            )}
          </button>
        </div>

        {/* Active Portal Interactive Stage */}
        {activePortal === 'past' && (
          <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-5 md:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-amber-200 md:col-span-5">
              <SceneImage
                src={ASSETS.pastLibrary}
                alt="طالبٌ ينهي ترتيبَ الكتبِ على الرفِّ"
                fallbackTitle="مشهدُ الفعلِ الماضي"
                className="h-56 w-full"
              />
            </div>
            <div className="space-y-4 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-800">البوابةُ الأولى · الماضي</span>
                <AudioExplainButton
                  id="a2_past"
                  text="رتّبَ الطالبُ الكتبَ أمسِ. نلاحظ أن الحدث وقع وانتهى قبل لحظة التكلم، وتؤكد ذلك قرينة أمسِ."
                  muted={muted}
                />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900">
                «<span className="rounded-lg bg-amber-200 px-2 py-0.5">رتّبَ</span> الطالبُ الكتبَ{' '}
                <span className="rounded-lg border border-amber-400 bg-white px-2 py-0.5 text-amber-800">
                  أمسِ
                </span>
                .»
              </p>
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                انتهى الطالبُ من ترتيبِ الكتبِ قبلَ أن نتكلمَ، لذا يقعُ الفعلُ «رتّبَ» في منطقةِ{' '}
                <strong>قبلَ لحظةِ التكلمِ</strong>، وقد ساعدَتْنا القرينةُ «أمسِ» على تأكيدِ ذلكَ.
              </p>
            </div>
          </div>
        )}

        {activePortal === 'present' && (
          <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-5 md:grid-cols-12">
            <div className="relative overflow-hidden rounded-xl border border-sky-200 md:col-span-5">
              <SceneImage
                src={ASSETS.presentReading}
                alt="خالدٌ يقرأُ قصةً في ركنِ القراءةِ"
                fallbackTitle="مشهدُ الفعلِ المضارعِ"
                className="h-56 w-full"
              />
              <div className="border-t border-sky-200 bg-white px-3 py-2 text-center text-xs font-bold text-sky-900">
                {state.presentTimeView === 'now'
                  ? 'الحالةُ الزمنيةُ: يحدثُ الآنَ في لحظةِ التكلمِ'
                  : 'الحالةُ الزمنيةُ: حدثٌ مخطَّطٌ ومتوقَّعٌ غداً في المستقبلِ'}
              </div>
            </div>

            <div className="space-y-4 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-sky-800">
                  البوابةُ الثانية · المضارعُ (الحاضرُ أو المستقبلُ)
                </span>
                <AudioExplainButton
                  id="a2_present"
                  text="الفعل المضارع يقرأ خالد قد يدل على الحاضر إذا قلنا الآن، وقد يدل على المستقبل إذا قلنا غداً بحسب السياق والقرينة."
                  muted={muted}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate({ ...state, presentTimeView: 'now' })}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                    state.presentTimeView === 'now'
                      ? 'bg-sky-600 text-white'
                      : 'border border-sky-200 bg-white text-sky-900 hover:bg-sky-50'
                  }`}
                >
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>الآنَ (الحاضرُ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ ...state, presentTimeView: 'tomorrow' })}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                    state.presentTimeView === 'tomorrow'
                      ? 'bg-sky-600 text-white'
                      : 'border border-sky-200 bg-white text-sky-900 hover:bg-sky-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>غداً (المستقبلُ)</span>
                </button>
              </div>

              <p className="font-display text-2xl font-extrabold text-slate-900">
                «<span className="rounded-lg bg-sky-200 px-2 py-0.5">يقرأُ</span> خالدٌ{' '}
                <span className="rounded-lg border border-sky-400 bg-white px-2 py-0.5 text-sky-800">
                  {state.presentTimeView === 'now' ? 'الآنَ' : 'غداً'}
                </span>
                .»
              </p>

              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                لاحظْ أنَّ الفعلَ «يقرأُ» لم يتغيّرْ شكلُهُ، لكنَّ القرينةَ تغيّرتْ! فالفعلُ المضارعُ قد
                يدلُّ على <strong>الحاضرِ</strong> أو <strong>المستقبلِ</strong> بحسبِ السياقِ
                والقرينةِ الزمنيةِ.
              </p>
            </div>
          </div>
        )}

        {activePortal === 'imperative' && (
          <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 md:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-emerald-200 md:col-span-5">
              <SceneImage
                src={ASSETS.imperativeTeamwork}
                alt="حوارٌ بينَ طالبينِ حولَ ترتيبِ الكتبِ وتوجيهِ طلبٍ"
                fallbackTitle="مشهدُ فعلِ الأمرِ"
                className="h-56 w-full"
              />
            </div>

            <div className="space-y-4 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-800">
                  البوابةُ الثالثة · الأمرُ (طلبٌ موجَّهٌ للمخاطبِ)
                </span>
                <AudioExplainButton
                  id="a2_imperative"
                  text="افتح الكتاب. فعل الأمر ليس حدثاً وقع بالفعل على خط الزمن، بل هو طلب من المخاطب للقيام بالفعل."
                  muted={muted}
                />
              </div>

              {/* Speech bubble + dashed arrow */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-emerald-300 bg-white px-5 py-3 shadow-xs">
                  <p className="text-xs font-bold text-emerald-700">فقاعةُ الحوارِ:</p>
                  <p className="font-display text-2xl font-extrabold text-slate-900">
                    «افتحِ الكتابَ»
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="border-b-2 border-dashed border-emerald-500 px-4 text-xs font-bold text-emerald-700"
                >
                  ←← توجيهٌ نحوَ الفعلِ المطلوبِ
                </span>
                <div className="rounded-xl border border-emerald-200 bg-emerald-100/70 px-4 py-2 text-sm font-bold text-emerald-950">
                  القيامُ بفتحِ الكتابِ
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                تذكّرْ دائماً: فعلُ الأمرِ <strong>طلبٌ من المخاطَبِ</strong> للقيامِ بالفعلِ، وليسَ
                حدثاً وقعَ بالفعلِ، ولذلكَ لا نضعُهُ في موضعِ الماضي أو المستقبلِ الإخباريِّ.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Comparison Activity: هل تخبر أم تطلب؟ */}
      <section id="a2-compare" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            نشاطُ المقارنةِ: هلْ تُخبرُ أمْ تطلبُ؟
          </h2>
          <p className="text-sm text-slate-600">
            حدّدْ لكلِّ جملةٍ: هلْ هيَ إخبارٌ عنْ حدثٍ (ماضٍ أو مضارعٍ) أمْ طلبٌ منْ مخاطبٍ (أمرٌ)؟
          </p>
        </div>

        <div className="space-y-3">
          {A2_COMPARE_ITEMS.map((item) => {
            const val = state.compareAnswers[item.id];
            const isCorrect = val === item.correctType;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-display text-base font-bold text-slate-900">
                    «{item.sentence}»
                  </p>
                  {compareChecked && (
                    <p
                      className={`text-xs font-medium ${
                        isCorrect ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {isCorrect ? `صحيح! ${item.explanation}` : 'تأمّلْ هل الجملةُ تخبرُ عنْ وقتٍ أمْ توجّهُ طلباً لشخصٍ؟'}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...state,
                        compareAnswers: { ...state.compareAnswers, [item.id]: 'inform' },
                      })
                    }
                    className={`min-h-[40px] rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap ${
                      val === 'inform'
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    إخبارٌ عنْ حدثٍ
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...state,
                        compareAnswers: { ...state.compareAnswers, [item.id]: 'request' },
                      })
                    }
                    className={`min-h-[40px] rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap ${
                      val === 'request'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    طلبٌ منْ مخاطبٍ
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
              setCompareChecked(true);
              if (allCompareCorrect) {
                audioManager.playTone('success');
              } else {
                audioManager.playTone('gentle');
              }
            }}
            className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
          >
            تحقّقْ منَ المقارنةِ
          </button>
          {compareChecked && (
            <span
              className={`text-sm font-bold ${
                allCompareCorrect ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              {allCompareCorrect
                ? 'أحسنت! جميعُ إجاباتِ المقارنةِ صحيحةٌ.'
                : 'راجعِ الجملَ التي لم تكتملْ أو تحتاجُ تعديلاً أعلاه.'}
            </span>
          )}
        </div>
      </section>

      {/* Short Check Question */}
      <section id="a2-check" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-lg font-bold text-slate-900">
          سؤالُ التحققِ الختاميِّ لبوابةِ الزمنِ:
        </h2>
        <p className="text-base text-slate-700">
          لماذا لا نضعُ فعلَ الأمرِ «افتحْ» على خطِّ الزمنِ معَ الأحداثِ التي وقعتْ أو ستقعُ؟
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              id: 'past_only',
              label: 'لأنَّهُ يدلُّ على حدثٍ انتهى أمسِ فقطْ.',
            },
            {
              id: 'outside_timeline',
              label: 'لأنَّهُ طلبٌ موجَّهٌ إلى المخاطَبِ ليقومَ بالفعلِ، وليسَ إخباراً عنْ حدثٍ واقعٍ.',
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onUpdate({ ...state, checkAnswer: opt.id })}
              className={`min-h-[48px] rounded-xl border p-4 text-right text-sm font-bold transition-colors ${
                state.checkAnswer === opt.id
                  ? 'border-teal-600 bg-teal-50 text-teal-950'
                  : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCheckFinalQuestion}
          className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          تحقّقْ
        </button>

        {checkFeedback && (
          <div
            className={`rounded-xl border p-4 text-sm font-medium ${
              checkFeedback.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-sky-200 bg-sky-50 text-sky-950'
            }`}
          >
            {checkFeedback.text}
          </div>
        )}
      </section>

      {/* Footer Next */}
      <StationChecklist
        requirements={[
          {
            id: 'portals',
            label: `استكشافُ البواباتِ الثلاثِ (${state.visitedPortals.length}/3)`,
            done: allPortalsVisited || isCompleted,
            targetSectionId: 'a2-portals',
          },
          {
            id: 'compare',
            label: 'نشاطُ المقارنةِ: هلْ تُخبرُ أمْ تطلبُ؟',
            done: allCompareCorrect || isCompleted,
            targetSectionId: 'a2-compare',
          },
          {
            id: 'check',
            label: 'سؤالُ التحققِ الختاميِّ لبوابةِ الزمنِ',
            done: state.checkPassed || isCompleted,
            targetSectionId: 'a2-check',
          },
        ]}
        readyMessage="أكملتَ استكشافَ بواباتِ الزمنِ الثلاثِ بنجاحٍ! هيا إلى مملكةِ الفعلِ الماضي."
        notReadyMessage="أكملِ البنودَ الآتيةَ للانتقالِ إلى الدرسِ الأولِ (الفعلُ الماضي):"
        nextButtonLabel="الانتقالُ إلى محطةِ الفعلِ الماضي (A3)"
        canComplete={canFinishStation}
        onComplete={onComplete}
      />
    </div>
  );
};
