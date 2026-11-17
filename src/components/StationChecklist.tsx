import React from 'react';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

export interface RequirementItem {
  id: string;
  label: string;
  done: boolean;
  targetSectionId?: string;
}

interface StationChecklistProps {
  requirements: RequirementItem[];
  readyMessage: string;
  notReadyMessage: string;
  nextButtonLabel: string;
  canComplete: boolean;
  onComplete: () => void;
}

export const StationChecklist: React.FC<StationChecklistProps> = ({
  requirements,
  readyMessage,
  notReadyMessage,
  nextButtonLabel,
  canComplete,
  onComplete,
}) => {
  const scrollToSection = (sectionId?: string) => {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (el) {
      const reduced = document.documentElement.classList.contains('reduce-motion');
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="space-y-2">
        <p className="font-display text-sm font-bold text-slate-900">
          {canComplete ? readyMessage : notReadyMessage}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {requirements.map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => scrollToSection(req.targetSectionId)}
              className={`flex min-h-[40px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-right text-xs font-bold transition-colors ${
                req.done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50/70 text-amber-950 hover:bg-amber-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {req.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                )}
                <span>{req.label}</span>
              </span>
              {!req.done && req.targetSectionId && (
                <span className="shrink-0 text-[11px] underline">اذهبْ إليها</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-3">
        <button
          type="button"
          disabled={!canComplete}
          onClick={onComplete}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <span>{nextButtonLabel}</span>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
