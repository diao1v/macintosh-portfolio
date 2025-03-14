import React, { useEffect, useState } from 'react';

interface StartupScreenProps {
  onLoadComplete: () => void;
  loadingTime?: number;
}

export const BLACK_SCREEN_TIME = 1000;
export const STARTUP_LOADING_TIME = 1000;

const StartupScreen: React.FC<StartupScreenProps> = ({
  onLoadComplete,
  loadingTime = STARTUP_LOADING_TIME,
}) => {
  const [progress, setProgress] = useState(0);
  const [showBlackScreen, setShowBlackScreen] = useState(true);

  useEffect(() => {
    // First show black screen for BLACK_SCREEN_TIME
    const blackScreenTimer = setTimeout(() => {
      setShowBlackScreen(false);
    }, BLACK_SCREEN_TIME);

    // Then start the loading progress after black screen
    const interval = setInterval(() => {
      if (!showBlackScreen) {
        setProgress((prev) => {
          const newProgress = prev + 2;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }
    }, loadingTime / 50);

    // Complete loading after black screen + loading time
    const loadingTimer = setTimeout(() => {
      onLoadComplete();
    }, BLACK_SCREEN_TIME + loadingTime);

    return () => {
      clearInterval(interval);
      clearTimeout(blackScreenTimer);
      clearTimeout(loadingTimer);
    };
  }, [loadingTime, onLoadComplete, showBlackScreen]);

  if (showBlackScreen) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#8e8e8e]">
      <div className="px-10 py-8 bg-gray-300">
        <div className="p-10 bg-white border border-gray-500 w-[460px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          <div className="flex justify-center">
            <img
              src="/pictures/MacOS_original_logo.svg"
              alt="Mac OS Logo"
            />
          </div>
        </div>
        <div className="p-4 text-center text-black font-chicago">
          Starting Up...
        </div>

        <div className="w-full h-4 bg-white border border-gray-500">
          <div
            className="h-full bg-gray-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StartupScreen;
