import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, RotateCcw, CheckCircle2, Compass } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="howto-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <h2 id="howto-title" className="font-display text-xl font-bold text-slate-900">
              كيفَ أستخدمُ الموقعَ؟
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الإرشادات"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="font-display font-bold text-slate-900">1. انتقلْ محطةً بمحطةٍ: </span>
            تبدأُ رحلتُكَ من «ذاكرةِ الأفعالِ» وتنفتحُ كلُّ محطةٍ جديدةٍ فورَ إتمامِكَ متطلباتِ المحطةِ التي تسبقُها.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="font-display font-bold text-slate-900">2. استكشفْ وتفاعلْ: </span>
            اضغطْ على الأفعالِ في المشاهدِ، واستخدمْ بوابةَ الزمنِ، وجداولَ الإسنادِ، وأزرارَ الحركاتِ المساعدةِ لتشكيلِ نهايةِ الفعلِ بدقةٍ.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="font-display font-bold text-slate-900">3. لا تخفْ من الخطأ: </span>
            عندَ الخطأِ في التدريباتِ سيساعدُكَ المرشدُ بتلميحٍ يوجّهُ تفكيرَكَ دونَ أن يكشفَ الإجابةَ مباشرةً، ويمكنُكَ مراجعةُ أيِّ محطةٍ مكتملةٍ في أيِّ وقتٍ.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="font-display font-bold text-slate-900">4. تقدّمُكَ محفوظٌ تلقائياً: </span>
            تُحفظُ إجاباتُكَ ومحاولاتُكَ على جهازِكَ محلياً دونَ الحاجةِ إلى تسجيلِ دخولٍ أو كتابةِ اسمِكَ، ويمكنُكَ استكمالُ رحلتِكَ عندَ العودةِ.
          </li>
        </ol>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>فهمتُ، لنبدأِ الرحلةَ!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  muted: boolean;
  reduceMotion: boolean;
  onToggleMute: () => void;
  onToggleReduceMotion: () => void;
  onResetAll: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  muted,
  reduceMotion,
  onToggleMute,
  onToggleReduceMotion,
  onResetAll,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 id="settings-title" className="font-display text-xl font-bold text-slate-900">
            إعداداتُ الصوتِ والحركةِ
          </h2>
          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onClose();
            }}
            aria-label="إغلاق الإعدادات"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Mute Setting */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              {muted ? (
                <VolumeX className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden="true" />
              ) : (
                <Volume2 className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden="true" />
              )}
              <div>
                <p className="font-display text-sm font-bold text-slate-900">
                  الصوتُ والتعليقُ الصوتيُّ
                </p>
                <p className="text-xs text-slate-600">
                  تشغيلُ أو كتمُ المؤثراتِ الصوتيةِ وزرِّ «استمع إلى الشرحِ».
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!muted}
              onClick={onToggleMute}
              className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                muted
                  ? 'border border-slate-300 bg-white text-slate-700'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {muted ? 'مكتومٌ' : 'مُفعَّلٌ'}
            </button>
          </div>

          {/* Reduce Motion Setting */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-sky-600" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-bold text-slate-900">تقليلُ الحركةِ</p>
                <p className="text-xs text-slate-600">
                  إيقافُ التأثيراتِ الحركيةِ الزائدةِ لتجربةٍ هادئةٍ ومريحةٍ للعينِ.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={onToggleReduceMotion}
              className={`min-h-[40px] rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                reduceMotion
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-300 bg-white text-slate-700'
              }`}
            >
              {reduceMotion ? 'مُفعَّلٌ' : 'عاديٌّ'}
            </button>
          </div>

          {/* Reset Progress */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-5 w-5 text-rose-600" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">
                    البدءُ من جديدٍ
                  </p>
                  <p className="text-xs text-slate-600">
                    مسحُ التقدمِ المحفوظِ محلياً وإعادةُ الرحلةِ من البدايةِ.
                  </p>
                </div>
              </div>
              {!confirmReset && (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="min-h-[40px] rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 whitespace-nowrap"
                >
                  إعادةُ ضبطٍ
                </button>
              )}
            </div>

            {confirmReset && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <span className="text-xs font-medium text-rose-900">
                  هل أنتَ متأكدٌ من مسحِ جميعِ إجاباتِكَ وتقدمِكَ؟
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    نعم، ابدأْ من جديدٍ
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    إلغاءٌ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onClose();
            }}
            className="min-h-[44px] rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            إغلاقٌ
          </button>
        </div>
      </div>
    </div>
  );
};
