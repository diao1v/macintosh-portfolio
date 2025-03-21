import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism, SyntaxHighlighterProps } from 'react-syntax-highlighter';
const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { File } from '@/store/useFileStore';
import { getContentForFile } from '@/content/';

interface MarkdownViewProps {
  file: File;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ file }) => {
  const type = file.type;
  const content = getContentForFile(file.id) as string;

  const textSize = type === 'code' ? 'text-[16px]' : 'text-[14px]';
  const padding = type === 'code' ? 'p-0' : 'p-4';
  const font = type === 'code' ? 'font-torrance' : 'font-chicago';
  return (
    <div
      className={`${padding} prose-sm prose rounded-none max-w-none ${font} ${textSize} flex flex-col overflow-hidden scrollbar-hide`}
    >
      <ReactMarkdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                wrapLines={true}
                style={darcula}
                customStyle={{
                  background: 'transparent',
                  lineHeight: '1',
                  height: '100vh',
                  overflow: 'hidden',
                  borderRadius: '0px',
                }}
                codeTagProps={{
                  style: {
                    lineHeight: '1',
                  },
                }}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
