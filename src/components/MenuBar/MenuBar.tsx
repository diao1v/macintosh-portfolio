import React from 'react';

const MenuBar: React.FC = () => {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 flex items-center h-5 px-1 bg-white border-b border-black'>
      <div className='relative group'>
        <div className='w-[13px] h-[13px] mr-2 ml-3'>
          <img
            src='/icons/apple.png'
            alt='Apple Logo'
            className='w-full h-full'
          />
        </div>
      </div>
      <div className='flex text-[11px] leading-none'>
        {['File', 'Edit', 'View', 'Label', 'Special'].map((item) => (
          <div key={item} className='relative px-2 py-1 cursor-default group'>
            <span className='group-hover:bg-black group-hover:text-white'>
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className='flex-grow' />
      <div className='text-[11px] leading-none pr-1'>2:41 PM</div>
    </div>
  );
};

export default MenuBar;
