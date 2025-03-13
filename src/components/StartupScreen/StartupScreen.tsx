import React, { useEffect, useState } from 'react';

interface StartupScreenProps {
  onLoadComplete: () => void;
  loadingTime?: number;
}

export const STARTUP_LOADING_TIME = 500;

const StartupScreen: React.FC<StartupScreenProps> = ({
  onLoadComplete,
  loadingTime = STARTUP_LOADING_TIME,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, loadingTime / 50);

    const timer = setTimeout(() => {
      onLoadComplete();
    }, loadingTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loadingTime, onLoadComplete]);

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-[#8e8e8e]'>
      <div className='px-10 py-8 bg-gray-300'>
        <div className='p-10 bg-white border border-gray-500 w-[560px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'>
          <div className='flex justify-center'>
            <img
              src='/pictures/MacOS_original_logo.svg'
              alt='Mac OS Logo'
              className='w-96'
            />
          </div>
        </div>
        <div className='p-4 text-center text-black font-chicago'>
          Starting Up...
        </div>

        <div className='w-full h-4 bg-white border border-gray-500'>
          <div
            className='h-full bg-gray-600'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StartupScreen;
