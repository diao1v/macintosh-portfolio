import React from 'react';

const AboutPortfolio: React.FC = () => {
  return (
    <div className='p-8 space-y-3'>
      <div className='flex items-center gap-4'>
        <img
          src='/icons/about_macintosh.png'
          alt='Computer Icon'
          className='w-16 h-16'
        />
        <div>
          <h2 className='text-[13px] font-bold'>Yiwei's Portfolio</h2>
          <p className='text-[11px]'>System Software 7.5.3 & 8 Mixture</p>
        </div>
      </div>
      <div className='py-2 border-t border-b border-black'>
        <p className='text-[11px]'>Memory Built-in: 8,192K</p>
        <p className='text-[11px]'>Total Memory: 8,192K</p>
        <p className='text-[11px]'>Built-in Time: 2005</p>
      </div>
      <p className='text-[11px]'>© Yiwei Diao 2025</p>
    </div>
  );
};

export default AboutPortfolio;
