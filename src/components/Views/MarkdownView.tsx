import React from 'react';
import { File } from '@/store/useFileStore';

interface MarkdownViewProps {
  file: File;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ file }) => {
  console.log(file);
  return (
    <div className='h-full p-2'>
      <div className='relative w-full h-full' style={{ minWidth: '400px' }}>
        123123
      </div>
    </div>
  );
};

export default MarkdownView;
