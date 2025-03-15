import React from 'react';

interface WindowSubHeaderProps {
  itemCount: number;
  diskSpace?: string;
}

const WindowSubHeader: React.FC<WindowSubHeaderProps> = ({
  itemCount,
  diskSpace,
}) => {
  return (
    <div className="flex items-center justify-between px-2 h-[24px] bg-white border-b border-[#999999]">
      <span className="text-[11px] font-chicago text-black">
        {itemCount} items
      </span>
      <span className="flex-grow" />
      <span className="text-[11px] font-chicago text-black">
        {diskSpace} MB in disk
      </span>
    </div>
  );
};

export default WindowSubHeader;
