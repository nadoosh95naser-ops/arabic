import React, { useState } from 'react';

interface ArabicVerbInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  diacriticHelpers?: Array<{ label: string; char: string }>;
  disabled?: boolean;
}

const DEFAULT_DIACRITICS = [
  { label: 'ضَمّة (ـُ)', char: '\u064F' },
  { label: 'فَتحة (ـَ)', char: '\u064E' },
  { label: 'كَسرة (ـِ)', char: '\u0650' },
  { label: 'سكون (ـْ)', char: '\u0652' },
];

export const ArabicVerbInput: React.FC<ArabicVerbInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'اكتبْ صيغةَ الفعلِ هنا...',
  diacriticHelpers = DEFAULT_DIACRITICS,
  disabled = false,
}) => {
  const [emptyTip, setEmptyTip] = useState(false);

  const appendDiacritic = (char: string) => {
    const trimmed = value.trimEnd();
    if (!trimmed) {
      setEmptyTip(true);
      return;
    }
    setEmptyTip(false);
    const last = trimmed[trimmed.length - 1];
    // Replace trailing haraka if one already exists on the last consonant
    if (/[\u064B-\u065F]/.test(last)) {
      onChange(trimmed.slice(0, -1) + char);
    } else {
      onChange(trimmed + char);
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        dir="rtl"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          if (emptyTip && e.target.value.trim()) setEmptyTip(false);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-2 focus:outline-teal-600/30 disabled:bg-slate-100"
      />
      {!disabled && (
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5" aria-label="أزرارُ الحركاتِ المساعدةِ">
            <span className="text-xs text-slate-500">حركةُ الحرفِ الأخيرِ:</span>
            {diacriticHelpers.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => appendDiacritic(d.char)}
                title={d.label}
                className="min-h-[30px] rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                {d.label}
              </button>
            ))}
          </div>
          {emptyTip && (
            <p className="text-[11px] font-medium text-amber-800">
              اكتبِ الكلمةَ في الحقلِ أولاً، ثمَّ اضغطْ على الحركةِ لتُضافَ إلى آخرِ حرفٍ.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
