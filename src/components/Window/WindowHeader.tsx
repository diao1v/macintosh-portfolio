import React from 'react';

interface WindowHeaderProps {
  title: string;
  onClose: () => void;
  onZoom?: () => void;
  isFocused: boolean;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ 
  title, 
  onClose, 
  onZoom, 
  isFocused 
}) => {
  return (
    <div
      className={`
        window-title-bar
        h-5 flex items-center select-none overflow-hidden
        ${
          isFocused
            ? 'bg-[url("/icons/titlebar.png")] bg-repeat border-b border-black'
            : 'bg-white border-b border-[#999999]'
        }
      `}
    >
      {isFocused ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className='w-3 h-3 mx-1 bg-white border border-black rounded-none
                     flex items-center justify-center
                     active:bg-[#000] focus:outline-none'
          >
            <div className='w-2 h-0.5 bg-black' />
          </button>
          <div className='flex justify-center flex-grow h-full'>
            <span className='h-full px-2 text-[11px] flex items-center font-chicago text-black bg-repeat bg-gray-200'>
              {title}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom?.();
            }}
            className='w-3 h-3 mx-1 bg-white border border-black rounded-none
                     flex items-center justify-center
                     active:bg-[#000] focus:outline-none'
          >
            <div className='w-2 h-2 border border-black'>
              <div className='w-full h-full bg-black transform translate-x-[1px] translate-y-[-1px]' />
            </div>
          </button>
        </>
      ) : (
        <span className='flex-grow text-center text-[11px] leading-none font-chicago text-black'>
          {title}
        </span>
      )}
    </div>
  );
};

export default WindowHeader; 