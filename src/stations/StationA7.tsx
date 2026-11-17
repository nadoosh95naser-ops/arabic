import React, { useState } from 'react';
import { CheckCircle2, PenTool } from 'lucide-react';
import { LearningProgressState } from '../types/learning';
import { GuideBanner } from '../components/GuideBanner';
import { StationChecklist } from '../components/StationChecklist';
import { sanitizeUserText } from '../utils/arabicHelpers';
import { audioManager } from '../utils/audio';

interface StationA7Props {
  state: LearningProgressState['a7'];
  muted: boolean;
  isCompleted: boolean;
  onUpdate: (next: LearningProgressState['a7']) => void;
  onComplete: () => void;
}

export const StationA7: React.FC<StationA7Props> = ({
  state,
  muted,
  isCompleted,
  onUpdate,
  onComplete,
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
    const p = sanitizeUserText(state.pastSentence);
    const pr = sanitizeUserText(state.presentSentence);
    const im = sanitizeUserText(state.imperativeSentence);

    if (!p || !pr || !im) {
      setNotice('اكتبْ جملةً واحدةً على الأقلِّ في كلِّ بطاقةٍ منَ البطاقاتِ الثلاثِ.');
      return;
    }
    const allChecked =
      state.pastChecks.every(Boolean) &&
      state.presentChecks.every(Boolean) &&
      state.imperativeChecks.every(Boolean);

    if (!allChecked) {
      setNotice('راجعْ بنودَ التحققِ الذاتيِّ داخلَ كلِّ بطاقةٍ قبلَ الحفظِ.');
      return;
    }

    audioManager.playTone('success');
    setNotice(null);
    onUpdate({
      ...state,
      pastSentence: p,
      presentSentence: pr,
      imperativeSentence: im,
      saved: true,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <GuideBanner
        title="ورشةُ الجملِ (A7) · أنا صانعُ الجملِ"
        message="الآنَ انتقلْ منَ الاختيارِ إلى الإبداعِ! اكتبْ جملةً من إنشائِكَ في كلِّ بطاقةٍ، واستخدمْ قائمةَ المراجعةِ الذاتيةِ للتأكدِ من عملِكَ."
        audioId="a7_intro"
        muted={muted}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: Past */}
        <section id="a7-past" className="flex flex-col justify-between space-y-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <PenTool className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold">البطاقةُ الأولى</span>
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">بطاقةُ الماضي</h2>
            <p className="text-xs text-slate-600">
              جملةٌ تخبرُ عنْ حدثٍ وقعَ وانتهى قبلَ زمنِ التكلمِ.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500">بداياتٌ اختياريةٌ:</span>
              {['أمسِ، ', 'شاركنا ', 'قرأتُ '].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    onUpdate({ ...state, pastSentence: starter, saved: false });
                  }}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-100"
                >
                  {starter.trim()}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              dir="rtl"
              value={state.pastSentence}
              onChange={(e) => {
                setNotice(null);
                onUpdate({ ...state, pastSentence: e.target.value, saved: false });
              }}
              placeholder="اكتبْ جملتَكَ الماضيةَ هنا..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30"
            />
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-700">مراجعتي الذاتيةُ:</p>
            {[
              'هلْ يدلُّ الفعلُ على حدثٍ انتهى؟',
              'هلِ المعنى واضحٌ ومكتملٌ؟',
            ].map((q, idx) => (
              <label key={idx} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(state.pastChecks[idx])}
                  onChange={(e) => {
                    const next = [...state.pastChecks];
                    next[idx] = e.target.checked;
                    setNotice(null);
                    onUpdate({ ...state, pastChecks: next, saved: false });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <span>{q}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Card 2: Present */}
        <section id="a7-present" className="flex flex-col justify-between space-y-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sky-800">
              <PenTool className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold">البطاقةُ الثانيةُ</span>
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">بطاقةُ المضارعِ</h2>
            <p className="text-xs text-slate-600">
              جملةٌ تبدأُ بفعلٍ مضارعٍ مع قرينةٍ تدلُّ على الحاضرِ أو المستقبلِ.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500">بداياتٌ اختياريةٌ:</span>
              {['نقرأُ الآنَ ', 'يرتّبُ فريقُنا ', 'غداً نزورُ '].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    onUpdate({ ...state, presentSentence: starter, saved: false });
                  }}
                  className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-900 hover:bg-sky-100"
                >
                  {starter.trim()}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              dir="rtl"
              value={state.presentSentence}
              onChange={(e) => {
                setNotice(null);
                onUpdate({ ...state, presentSentence: e.target.value, saved: false });
              }}
              placeholder="اكتبْ جملتَكَ المضارعةَ هنا..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30"
            />
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-700">مراجعتي الذاتيةُ:</p>
            {[
              'هلْ استخدمتُ فعلاً مضارعاً مع قرينةٍ (الآنَ/غداً)؟',
              'هلِ المعنى واضحٌ ومكتملٌ؟',
            ].map((q, idx) => (
              <label key={idx} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(state.presentChecks[idx])}
                  onChange={(e) => {
                    const next = [...state.presentChecks];
                    next[idx] = e.target.checked;
                    setNotice(null);
                    onUpdate({ ...state, presentChecks: next, saved: false });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <span>{q}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Card 3: Imperative */}
        <section id="a7-imperative" className="flex flex-col justify-between space-y-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <PenTool className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold">البطاقةُ الثالثةُ</span>
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">بطاقةُ الأمرِ</h2>
            <p className="text-xs text-slate-600">
              جملةٌ تطلبُ فيها من مخاطبٍ القيامَ بفعلٍ مناسبٍ.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-slate-500">بداياتٌ اختياريةٌ:</span>
              {['افتحِ ', 'يا صديقتي، اقرئي ', 'تعاونوا '].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    onUpdate({ ...state, imperativeSentence: starter, saved: false });
                  }}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 hover:bg-emerald-100"
                >
                  {starter.trim()}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              dir="rtl"
              value={state.imperativeSentence}
              onChange={(e) => {
                setNotice(null);
                onUpdate({ ...state, imperativeSentence: e.target.value, saved: false });
              }}
              placeholder="اكتبْ جملةَ الأمرِ هنا..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30"
            />
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-700">مراجعتي الذاتيةُ:</p>
            {[
              'هلْ وجّهتُ طلباً إلى مخاطبٍ بفعلِ أمرٍ؟',
              'هلْ يطابقُ الفعلُ المخاطَبَ الذي أكلّمهُ؟',
            ].map((q, idx) => (
              <label key={idx} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(state.imperativeChecks[idx])}
                  onChange={(e) => {
                    const next = [...state.imperativeChecks];
                    next[idx] = e.target.checked;
                    setNotice(null);
                    onUpdate({ ...state, imperativeChecks: next, saved: false });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <span>{q}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Save & Next */}
      <div id="a7-save" className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
        <button
          type="button"
          onClick={handleSave}
          className="min-h-[44px] rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          احفظْ إبداعَكَ
        </button>
        {state.saved ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            تمَّ حفظُ جملِكَ الثلاثِ في ملفِّك!
          </span>
        ) : (
          (state.pastSentence.trim() || state.presentSentence.trim() || state.imperativeSentence.trim()) && (
            <span className="text-xs font-bold text-amber-800">
              اضغطْ «احفظْ إبداعَكَ» بعدَ إتمامِ المراجعةِ الذاتيةِ في البطاقاتِ الثلاثِ.
            </span>
          )
        )}
        {notice && <span className="text-sm font-medium text-amber-800">{notice}</span>}
      </div>

      <StationChecklist
        requirements={[
          {
            id: 'past-card',
            label: '1. بطاقةُ الماضي ومراجعتُها الذاتيةُ',
            done:
              (Boolean(sanitizeUserText(state.pastSentence)) &&
                state.pastChecks.every(Boolean)) ||
              isCompleted,
            targetSectionId: 'a7-past',
          },
          {
            id: 'present-card',
            label: '2. بطاقةُ المضارعِ ومراجعتُها الذاتيةُ',
            done:
              (Boolean(sanitizeUserText(state.presentSentence)) &&
                state.presentChecks.every(Boolean)) ||
              isCompleted,
            targetSectionId: 'a7-present',
          },
          {
            id: 'imp-card',
            label: '3. بطاقةُ الأمرِ ومراجعتُها الذاتيةُ',
            done:
              (Boolean(sanitizeUserText(state.imperativeSentence)) &&
                state.imperativeChecks.every(Boolean)) ||
              isCompleted,
            targetSectionId: 'a7-imperative',
          },
          {
            id: 'save-card',
            label: '4. حفظُ الإبداعِ في ملفِّكَ',
            done: state.saved || isCompleted,
            targetSectionId: 'a7-save',
          },
        ]}
        readyMessage="أتممتَ ورشةَ الجملِ بنجاحٍ! هيا إلى الاختبارِ الختاميِّ."
        notReadyMessage="أكملِ البنودَ الآتيةَ للانتقالِ إلى الاختبارِ الختاميِّ:"
        nextButtonLabel="الانتقالُ إلى الاختبارِ الختاميِّ (13 سؤالاً)"
        canComplete={state.saved || isCompleted}
        onComplete={onComplete}
      />
    </div>
  );
};
