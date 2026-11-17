import { useEffect, useState } from 'react';
import { STATIONS } from './data/curriculum';
import { LearningProgressState, StationId } from './types/learning';
import { loadProgressState, resetProgressState, saveProgressState } from './utils/storage';
import { audioManager } from './utils/audio';
import { HeaderAndProgress } from './components/HeaderAndProgress';
import { HowToUseModal, SettingsModal } from './components/Modals';
import { HomeScreen, JourneyMapScreen } from './stations/HomeAndMap';
import { StationA1 } from './stations/StationA1';
import { StationA2 } from './stations/StationA2';
import { StationA3 } from './stations/StationA3';
import { StationA4 } from './stations/StationA4';
import { StationA5 } from './stations/StationA5';
import { StationA6 } from './stations/StationA6';
import { StationA7 } from './stations/StationA7';
import { StationQuiz } from './stations/StationQuiz';
import { StationA8 } from './stations/StationA8';
import { StationResults } from './stations/StationResults';

export default function App() {
  const [progress, setProgress] = useState<LearningProgressState>(() => loadProgressState());
  const [currentStation, setCurrentStation] = useState<StationId>('home');
  const [howToOpen, setHowToOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Persist progress whenever it changes
  useEffect(() => {
    saveProgressState(progress);
  }, [progress]);

  // Sync audio mute & reduced motion class on document root
  useEffect(() => {
    audioManager.setMuted(progress.settings.muted);
    if (progress.settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [progress.settings.muted, progress.settings.reduceMotion]);

  const isStationUnlocked = (stationId: StationId): boolean => {
    if (stationId === 'home' || stationId === 'map') return true;
    const meta = STATIONS.find((s) => s.id === stationId);
    if (!meta || !meta.requiresPrevious) return true;
    return progress.completedStations.includes(meta.requiresPrevious);
  };

  const navigateTo = (target: StationId) => {
    audioManager.stopSpeech();
    if (!isStationUnlocked(target)) {
      setCurrentStation('map');
      return;
    }
    setCurrentStation(target);
    if (target !== 'home' && target !== 'map') {
      setProgress((prev) => ({
        ...prev,
        lastValidStation: target,
      }));
    }
    window.scrollTo({ top: 0, behavior: progress.settings.reduceMotion ? 'auto' : 'smooth' });
  };

  const completeStationAndAdvance = (
    stationId: Exclude<StationId, 'home' | 'map'>,
    nextStation: StationId
  ) => {
    audioManager.stopSpeech();
    audioManager.playTone('success');
    setProgress((prev) => {
      const nextCompleted = prev.completedStations.includes(stationId)
        ? prev.completedStations
        : [...prev.completedStations, stationId];
      return {
        ...prev,
        completedStations: nextCompleted,
        lastValidStation: nextStation !== 'home' && nextStation !== 'map' ? nextStation : prev.lastValidStation,
      };
    });
    setCurrentStation(nextStation);
    window.scrollTo({ top: 0, behavior: progress.settings.reduceMotion ? 'auto' : 'smooth' });
  };

  const hasSavedProgress =
    progress.completedStations.length > 0 ||
    progress.lastValidStation !== 'home' ||
    Object.keys(progress.a1.answers).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeaderAndProgress
        currentStation={currentStation}
        completedStations={progress.completedStations}
        onNavigate={navigateTo}
        onOpenHowTo={() => setHowToOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main>
        {currentStation === 'home' && (
          <HomeScreen
            hasSavedProgress={hasSavedProgress}
            lastValidStation={
              progress.lastValidStation === 'home' ? 'a1' : progress.lastValidStation
            }
            completedCount={progress.completedStations.length}
            muted={progress.settings.muted}
            onStartFreshOrA1={() => navigateTo('a1')}
            onResume={() =>
              navigateTo(
                progress.lastValidStation !== 'home' &&
                  isStationUnlocked(progress.lastValidStation)
                  ? progress.lastValidStation
                  : 'a1'
              )
            }
            onOpenMap={() => navigateTo('map')}
            onOpenHowTo={() => setHowToOpen(true)}
          />
        )}

        {currentStation === 'map' && (
          <JourneyMapScreen
            completedStations={progress.completedStations}
            currentStation={currentStation}
            onSelectStation={(id) => navigateTo(id)}
          />
        )}

        {currentStation === 'a1' && (
          <StationA1
            state={progress.a1}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a1')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a1: next }))}
            onComplete={() => completeStationAndAdvance('a1', 'a2')}
          />
        )}

        {currentStation === 'a2' && (
          <StationA2
            state={progress.a2}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a2')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a2: next }))}
            onComplete={() => completeStationAndAdvance('a2', 'a3')}
          />
        )}

        {currentStation === 'a3' && (
          <StationA3
            state={progress.a3}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a3')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a3: next }))}
            onComplete={() => completeStationAndAdvance('a3', 'a4')}
          />
        )}

        {currentStation === 'a4' && (
          <StationA4
            state={progress.a4}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a4')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a4: next }))}
            onComplete={() => completeStationAndAdvance('a4', 'a5')}
          />
        )}

        {currentStation === 'a5' && (
          <StationA5
            state={progress.a5}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a5')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a5: next }))}
            onComplete={() => completeStationAndAdvance('a5', 'a6')}
          />
        )}

        {currentStation === 'a6' && (
          <StationA6
            state={progress.a6}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a6')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a6: next }))}
            onComplete={() => completeStationAndAdvance('a6', 'a7')}
          />
        )}

        {currentStation === 'a7' && (
          <StationA7
            state={progress.a7}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a7')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a7: next }))}
            onComplete={() => completeStationAndAdvance('a7', 'quiz')}
          />
        )}

        {currentStation === 'quiz' && (
          <StationQuiz
            state={progress.quiz}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('quiz')}
            onUpdate={(next) =>
              setProgress((prev) => ({
                ...prev,
                quiz: next,
                completedStations:
                  next.attempts.length > prev.quiz.attempts.length &&
                  !prev.completedStations.includes('quiz')
                    ? [...prev.completedStations, 'quiz']
                    : prev.completedStations,
              }))
            }
            onComplete={() => completeStationAndAdvance('quiz', 'a8')}
          />
        )}

        {currentStation === 'a8' && (
          <StationA8
            state={progress.a8}
            muted={progress.settings.muted}
            isCompleted={progress.completedStations.includes('a8')}
            onUpdate={(next) => setProgress((prev) => ({ ...prev, a8: next }))}
            onComplete={() => {
              audioManager.stopSpeech();
              audioManager.playTone('success');
              setProgress((prev) => {
                const nextCompleted = new Set(prev.completedStations);
                nextCompleted.add('a8');
                nextCompleted.add('results');
                return {
                  ...prev,
                  completedStations: Array.from(nextCompleted),
                  lastValidStation: 'results',
                };
              });
              setCurrentStation('results');
              window.scrollTo({
                top: 0,
                behavior: progress.settings.reduceMotion ? 'auto' : 'smooth',
              });
            }}
          />
        )}

        {currentStation === 'results' && (
          <StationResults
            progress={progress}
            onGoToStation={(station) => navigateTo(station)}
            onRetakeQuiz={() => {
              setProgress((prev) => ({
                ...prev,
                quiz: {
                  ...prev.quiz,
                  currentAnswers: {},
                  currentIndex: 0,
                  inReview: false,
                  viewingAttemptId: null,
                },
              }));
              navigateTo('quiz');
            }}
          />
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>رحلة عبر الزمن اللغوي · الفعل بين الزمن والمعنى · الصف الخامس الأساسي</p>
      </footer>

      <HowToUseModal isOpen={howToOpen} onClose={() => setHowToOpen(false)} />

      <SettingsModal
        isOpen={settingsOpen}
        muted={progress.settings.muted}
        reduceMotion={progress.settings.reduceMotion}
        onToggleMute={() =>
          setProgress((prev) => ({
            ...prev,
            settings: { ...prev.settings, muted: !prev.settings.muted },
          }))
        }
        onToggleReduceMotion={() =>
          setProgress((prev) => ({
            ...prev,
            settings: { ...prev.settings, reduceMotion: !prev.settings.reduceMotion },
          }))
        }
        onResetAll={() => {
          const fresh = resetProgressState();
          setProgress(fresh);
          setCurrentStation('home');
        }}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
