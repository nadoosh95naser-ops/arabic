import React from 'react';
import {
  Compass,
  Play,
  RotateCcw,
  HelpCircle,
  Lock,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { ASSETS, STATIONS } from '../data/curriculum';
import { StationId } from '../types/learning';
import { SceneImage } from '../components/SceneImage';
import { AudioExplainButton } from '../components/AudioExplainButton';

interface HomeScreenProps {
  hasSavedProgress: boolean;
  lastValidStation: StationId;
  completedCount: number;
  muted: boolean;
  onStartFreshOrA1: () => void;
  onResume: () => void;
  onOpenMap: () => void;
  onOpenHowTo: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedProgress,
  lastValidStation,
  completedCount,
  muted,
  onStartFreshOrA1,
  onResume,
  onOpenMap,
  onOpenHowTo,
}) => {
  const lastStationMeta = STATIONS.find((s) => s.id === lastValidStation);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero Split */}
      <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-teal-700">
              اللغةُ العربيةُ · الصفُّ الخامسُ الأساسيُّ · المنهاجُ الفلسطينيُّ
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              رحلةٌ عبرَ الزمنِ اللغويِّ
            </h1>
            <p className="font-display text-xl font-bold text-sky-700">
              الوحدةُ التعليميةُ: الفعلُ بينَ الزمنِ والمعنى
            </p>
            <p className="text-base leading-relaxed text-slate-700">
              اكتشفِ الفعلَ، وافهمِ الزمنَ، واصنعِ المعنى! انطلقْ معَ مرشدِكَ «كريم» بينَ بواباتِ الزمنِ
              لاكتشافِ كيفَ تعبّرُ الأفعالُ عنِ الحدثِ والوقتِ والطلبِ.
            </p>
          </div>

          {/* Central Mission Box */}
          <div className="space-y-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-teal-950">
                مهمتُكَ المركزيةُ في هذهِ الرحلةِ:
              </h2>
              <AudioExplainButton
                id="home_mission"
                text="أهلاً بك في رحلة عبر الزمن اللغوي! مهمتك هي مساعدة فريق المدرسة على إعداد ركن قراءة جميل ومنظم. ستكتشف ماذا فعل الفريق بالأمس، وماذا يفعل الآن أو سيفعل غداً، وماذا نطلب من أعضاء الفريق أن يفعلوا."
                muted={muted}
              />
            </div>
            <p className="font-display text-lg font-bold text-slate-900">
              مساعدةُ فريقِ المدرسةِ على إعدادِ ركنِ قراءةٍ جميلٍ ومنظّمٍ!
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              <li>• ماذا فعلَ الفريقُ بالأمسِ؟</li>
              <li>• ماذا يفعلُ الآنَ أو سيفعلُ غداً؟</li>
              <li>• ماذا نطلبُ من أعضاءِ الفريقِ أن يفعلوا؟</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {hasSavedProgress ? (
              <>
                <button
                  type="button"
                  onClick={onResume}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  <span>
                    استكملْ رحلتي
                    {lastStationMeta ? ` (${lastStationMeta.title})` : ''}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMap}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  <Compass className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  <span>خريطةُ الرحلةِ ({completedCount} / {STATIONS.length})</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartFreshOrA1}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-teal-600 px-7 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>ابدأِ الرحلةَ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHowTo}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              <HelpCircle className="h-4 w-4 text-sky-600" aria-hidden="true" />
              <span>كيفَ أستخدمُ الموقعَ؟</span>
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
          <div className="relative flex-1 min-h-[300px]">
            <SceneImage
              src={ASSETS.heroPortals}
              alt="عالمُ الزمنِ اللغويِّ وبواباتُهُ الثلاثُ للماضي والمضارعِ والأمرِ مع المرشدِ كريم"
              fallbackTitle="بواباتُ الزمنِ اللغويِّ"
              className="h-full w-full lg:h-full"
            />
          </div>
          <div className="flex items-center gap-4 border-t border-slate-100 bg-slate-50 p-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <SceneImage
                src={ASSETS.guidePortrait}
                alt="المرشدُ كريم"
                fallbackTitle="كريم"
                className="h-full w-full"
              />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-slate-900">
                المرشدُ كريم يرحّبُ بكَ:
              </p>
              <p className="text-sm text-slate-600">
                «مرحباً يا صديقي! أمامنا ثلاثُ بواباتٍ زمنيةٍ ومهمةٌ مشوّقةٌ لتجهيزِ ركنِ القراءةِ.»
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Preview Strip (3 Portals Overview) */}
      <section aria-label="محاور الوحدة الثلاثة" className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-white p-5">
          <p className="text-xs font-bold text-amber-700">البوابةُ الأولى · الماضي</p>
          <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
            ماذا فعلَ الفريقُ أمسِ؟
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            نستكشفُ الأحداثَ التي وقعتْ وانتهتْ قبلَ زمنِ التكلمِ، ونُسندُ الفعلَ الماضيَ إلى
            الضمائرِ التسعةِ.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-white p-5">
          <p className="text-xs font-bold text-sky-700">البوابةُ الثانية · المضارع</p>
          <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
            ماذا يفعلُ الآنَ أو غداً؟
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            نكتشفُ أحرفَ المضارعةِ «نأتي»، وكيفَ يرتبطُ الفعلُ المضارعُ بالحاضرِ أو المستقبلِ
            بحسبِ القرينةِ.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5">
          <p className="text-xs font-bold text-emerald-700">البوابةُ الثالثة · الأمر</p>
          <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
            ماذا نطلبُ من الفريقِ؟
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            نميّزُ بينَ الإخبارِ والطلبِ، ونتدرّبُ على توجيهِ التعليماتِ الذكيةِ لضمائرِ
            المخاطبِ الخمسةِ.
          </p>
        </div>
      </section>
    </div>
  );
};

interface JourneyMapScreenProps {
  completedStations: Array<Exclude<StationId, 'home' | 'map'>>;
  currentStation: StationId;
  onSelectStation: (station: Exclude<StationId, 'home' | 'map'>) => void;
}

export const JourneyMapScreen: React.FC<JourneyMapScreenProps> = ({
  completedStations,
  onSelectStation,
}) => {
  const isUnlocked = (station: (typeof STATIONS)[number]): boolean => {
    if (!station.requiresPrevious) return true;
    return completedStations.includes(station.requiresPrevious);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-teal-700">
          التقدّمُ المحفوظُ · {completedStations.length} من {STATIONS.length} محطاتٍ مكتملةً
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          خريطةُ الرحلةِ التعليميةِ
        </h1>
        <p className="text-base text-slate-600">
          تُفتحُ كلُّ محطةٍ جديدةٍ بعدَ إتمامِ متطلباتِ المحطةِ السابقةِ، ويمكنُكَ العودةُ لمراجعةِ أيِّ
          محطةٍ مكتملةٍ دونَ فقدِ إجاباتِكَ.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {STATIONS.map((station) => {
          const completed = completedStations.includes(station.id);
          const unlocked = isUnlocked(station);
          const prevTitle = station.requiresPrevious
            ? STATIONS.find((s) => s.id === station.requiresPrevious)?.title
            : '';

          return (
            <div
              key={station.id}
              className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 transition-colors ${
                completed
                  ? 'border-emerald-200 bg-white'
                  : unlocked
                    ? 'border-teal-300 bg-white shadow-sm'
                    : 'border-slate-200 bg-slate-100/70 opacity-85'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <span className="text-slate-500">
                    المحطةُ {station.order} · {station.code}
                  </span>
                  {completed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      مكتملةٌ
                    </span>
                  ) : unlocked ? (
                    <span className="inline-flex items-center gap-1 text-teal-700">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      متاحةٌ الآنَ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Lock className="h-4 w-4" aria-hidden="true" />
                      مقفلةٌ
                    </span>
                  )}
                </div>

                <h2 className="font-display text-lg font-bold text-slate-900">
                  {station.title} — <span className="text-slate-600 font-medium">{station.subtitle}</span>
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">{station.description}</p>
              </div>

              <div className="pt-2">
                {unlocked ? (
                  <button
                    type="button"
                    onClick={() => onSelectStation(station.id)}
                    className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                      completed
                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <span>{completed ? 'مراجعةُ المحطةِ' : 'ابدأِ المحطةَ'}</span>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <p className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-center text-xs font-medium text-slate-500">
                    تُفتحُ بعدَ إتمامِ محطةِ «{prevTitle}»
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
