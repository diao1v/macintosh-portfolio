import React from 'react';
import ReactMarkdown from 'react-markdown';
import { File } from '@/store/useFileStore';

interface MarkdownViewProps {
  file: File;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ file }) => {
  return (
    <div className='p-8 font-chicago text-[11px]'>
      <div className='prose-sm prose max-w-none prose-headings:font-chicago prose-headings:mb-2'>
        <ReactMarkdown>{file.content || ''}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownView;
