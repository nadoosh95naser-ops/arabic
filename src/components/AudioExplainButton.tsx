import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface AudioExplainButtonProps {
  id: string;
  text: string;
  label?: string;
  muted?: boolean;
}

export const AudioExplainButton: React.FC<AudioExplainButtonProps> = ({
  id,
  text,
  label = 'استمع إلى الشرح',
  muted = false,
}) => {
  const [speakingId, setSpeakingId] = useState<string | null>(
    audioManager.getCurrentSpeakingId()
  );
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    return audioManager.subscribeSpeaking(setSpeakingId);
  }, []);

  const isPlaying = speakingId === id;

  const handleClick = () => {
    setNotice(null);
    if (muted) {
      setNotice('الصوت مكتومٌ حالياً؛ يمكنك تشغيلهُ من إعدادات الصوت.');
      return;
    }
    const res = audioManager.speakArabic(id, text);
    if (!res.supported) {
      setNotice('القراءةُ الصوتيةُ غيرُ مدعومةٍ في هذا المتصفح، والشرحُ المكتوبُ متاحٌ أمامك.');
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isPlaying}
        className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
          isPlaying
            ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800'
        }`}
      >
        {isPlaying ? (
          <>
            <VolumeX className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>إيقافُ الصوتِ</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>
      {notice && <p className="text-xs text-amber-700">{notice}</p>}
    </div>
  );
};
