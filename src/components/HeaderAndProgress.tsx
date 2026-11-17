import React from 'react';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import { STATIONS } from '../data/curriculum';
import { StationId } from '../types/learning';

interface HeaderAndProgressProps {
  currentStation: StationId;
  completedStations: Array<Exclude<StationId, 'home' | 'map'>>;
  onNavigate: (station: StationId) => void;
  onOpenHowTo: () => void;
  onOpenSettings: () => void;
}

export const HeaderAndProgress: React.FC<HeaderAndProgressProps> = ({
  currentStation,
  completedStations,
  onNavigate,
  onOpenHowTo,
  onOpenSettings,
}) => {
  const totalLearningStations = STATIONS.length; // 10 stations (A1..A8 + Quiz + Results)
  const completedCount = completedStations.length;
  const progressPercent = Math.round((completedCount / totalLearningStations) * 100);
  const currentMeta = STATIONS.find((s) => s.id === currentStation);
  const resultsUnlocked = completedStations.includes('a8');

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      {/* Strict 3-zone top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
        {/* Zone 1: Brand wordmark (1 line) */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          رحلة عبر الزمن اللغوي
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              currentStation === 'home' ? 'text-teal-700 font-bold underline underline-offset-8' : ''
            }`}
          >
            الرئيسية
          </button>
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              currentStation === 'map' ? 'text-teal-700 font-bold underline underline-offset-8' : ''
            }`}
          >
            خريطة الرحلة
          </button>
          <button
            type="button"
            onClick={() => onNavigate(resultsUnlocked ? 'results' : 'map')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
              currentStation === 'results'
                ? 'text-teal-700 font-bold underline underline-offset-8'
                : ''
            }`}
          >
            ملف المهارات
          </button>
          <button
            type="button"
            onClick={onOpenHowTo}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            كيف أستخدم الموقع؟
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 whitespace-nowrap shrink-0 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <SlidersHorizontal className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <span className="hidden sm:inline">إعدادات الصوت والحركة</span>
            <span className="sm:hidden">الإعدادات</span>
          </button>
        </div>
      </header>

      {/* Mobile quick nav row (kept concise to stay well under 15% mobile height) */}
      <div className="flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 md:hidden">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`px-2 py-1 whitespace-nowrap ${currentStation === 'home' ? 'font-bold text-teal-700' : ''}`}
        >
          الرئيسية
        </button>
        <button
          type="button"
          onClick={() => onNavigate('map')}
          className={`px-2 py-1 whitespace-nowrap ${currentStation === 'map' ? 'font-bold text-teal-700' : ''}`}
        >
          الخريطة
        </button>
        <button
          type="button"
          onClick={onOpenHowTo}
          className="px-2 py-1 whitespace-nowrap"
        >
          دليل الاستخدام
        </button>
      </div>

      {/* Journey Progress Strip (shown inside stations) */}
      {currentStation !== 'home' && (
        <div className="border-t border-slate-100 bg-slate-50/90">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              {currentStation !== 'map' && (
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:text-teal-900 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span>خريطة الرحلة</span>
                </button>
              )}
              {currentMeta && (
                <>
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                  <span className="font-semibold text-slate-800">
                    {currentMeta.code} · {currentMeta.title}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 tabular-nums">
                الإنجاز: {completedCount} من {totalLearningStations} ({progressPercent}%)
              </span>
              <div
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="نسبة التقدم في الرحلة التعليمية"
                className="h-2 w-28 overflow-hidden rounded-full bg-slate-200 sm:w-40"
              >
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
