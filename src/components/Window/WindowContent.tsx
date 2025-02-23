import React from 'react';

interface WindowContentProps {
  itemCount: number;
  diskSpace?: string;
}

const WindowContent: React.FC<WindowContentProps> = ({ itemCount, diskSpace }) => {
  return (
    <div className='flex items-center justify-between px-2 h-[22px] bg-white border-b border-[#999999]'>
      <span className='text-[11px] font-chicago text-black'>
        {itemCount} items
      </span>
      <span className='flex-grow' />
      <span className='text-[11px] font-chicago text-black'>
        {diskSpace} MB in disk
      </span>
    </div>
  );
};

export default WindowContent; 