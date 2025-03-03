import React from 'react';
import ReactMarkdown from 'react-markdown';
import { File } from '@/store/useFileStore';

interface MarkdownViewProps {
  file: File;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ file }) => {
  return (
    <div className='p-8 text-[10px]'>
      <div className='prose prose-xs max-w-none prose-headings:mb-1'>
        <ReactMarkdown>{file.content || ''}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownView;
