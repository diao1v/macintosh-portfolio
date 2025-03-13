import React, { useState, useEffect } from 'react';
import { File } from '@/store/useFileStore';
import useFileStore from '@/store/useFileStore';

interface EditableTextViewProps {
  file: File;
}

const EditableTextView: React.FC<EditableTextViewProps> = ({ file }) => {
  const { markFileAsDirty, markFileAsClean, setPendingContent } =
    useFileStore();
  const [content, setContent] = useState(file.content || '');

  // Update content when file changes
  useEffect(() => {
    setContent(file.content || '');
    markFileAsClean(file.id);
  }, [file.id, file.content, markFileAsClean]);

  // Track changes but don't save automatically
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    markFileAsDirty(file.id);
    setPendingContent(file.id, newContent);
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <textarea
        className="w-full min-h-[calc(100vh-200px)] p-4 text-sm text-black bg-white outline-none resize-none font-torrance"
        value={content}
        onChange={handleChange}
        spellCheck={false}
        autoFocus
      />
    </div>
  );
};

export default EditableTextView;
