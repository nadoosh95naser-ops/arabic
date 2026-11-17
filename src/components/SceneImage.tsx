import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SceneImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 via-slate-50 to-amber-50 p-6 text-center text-slate-700 ${className}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="font-display text-base font-bold text-slate-800">{fallbackTitle}</p>
        <p className="max-w-sm text-sm text-slate-600">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
};
