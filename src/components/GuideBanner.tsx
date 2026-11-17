import React from 'react';
import { ASSETS } from '../data/curriculum';
import { SceneImage } from './SceneImage';
import { AudioExplainButton } from './AudioExplainButton';

interface GuideBannerProps {
  title: string;
  message: string;
  audioId?: string;
  muted?: boolean;
  tone?: 'default' | 'success' | 'hint' | 'warning';
}

export const GuideBanner: React.FC<GuideBannerProps> = ({
  title,
  message,
  audioId,
  muted = false,
  tone = 'default',
}) => {
  const toneClasses: Record<NonNullable<GuideBannerProps['tone']>, string> = {
    default: 'border-slate-200 bg-white',
    success: 'border-emerald-200 bg-emerald-50/70',
    hint: 'border-sky-200 bg-sky-50/70',
    warning: 'border-amber-200 bg-amber-50/70',
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${toneClasses[tone]}`}
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <SceneImage
            src={ASSETS.guidePortrait}
            alt="شخصيةُ المرشدِ التعليميِّ كريم"
            fallbackTitle="المرشدُ كريم"
            className="h-full w-full"
          />
        </div>
        <div className="space-y-1">
          <p className="font-display text-sm font-bold text-slate-900">{title}</p>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{message}</p>
        </div>
      </div>
      {audioId && (
        <div className="shrink-0">
          <AudioExplainButton id={audioId} text={`${title}. ${message}`} muted={muted} />
        </div>
      )}
    </div>
  );
};
