import React from 'react';

const AboutPortfolio: React.FC = () => {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-4'>
        <img
          src='/icons/drive-harddisk.png'
          alt='Computer Icon'
          className='w-16 h-16'
        />
        <div>
          <h2 className='text-[13px] font-bold'>Your Name's Portfolio</h2>
          <p className='text-[11px]'>System Software 7.5.3</p>
        </div>
      </div>
      <div className='py-2 border-t border-b border-black'>
        <p className='text-[11px]'>Memory Built-in: 8,192K</p>
        <p className='text-[11px]'>Total Memory: 8,192K</p>
      </div>
      <p className='text-[11px]'>© Your Name 2024</p>
    </div>
  );
};

export default AboutPortfolio; 