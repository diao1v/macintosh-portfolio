import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import useDialogStore from '@/store/useDialogStore';

const Dialog: React.FC = () => {
  const { isOpen, dialogProps, closeDialog } = useDialogStore();

  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 160,
    y: window.innerHeight / 2 - 180,
  });

  useEffect(() => {
    if (isOpen) {
      setPosition({
        x: window.innerWidth / 2 - 160,
        y: window.innerHeight / 2 - 180,
      });
    }
  }, [isOpen]);

  if (!isOpen || !dialogProps) return null;

  const {
    title,
    message,
    icon = '/icons/about_macintosh.png',
    buttons = [{ label: 'OK', onClick: () => {}, primary: true }],
  } = dialogProps;

  const imageAlt = icon.split('/').pop()?.split('.')[0] || 'info';

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-30 flex items-center justify-center">
      <Rnd
        position={position}
        onDragStop={(_e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        dragHandleClassName="dialog-title-bar"
        bounds="parent"
        enableResizing={false}
        style={{ zIndex: 10000 }}
      >
        <div className="bg-white border border-black shadow-md w-80">
          {/* Dialog header */}
          <div className="dialog-title-bar h-5 bg-[url('/icons/titlebar.png')] bg-repeat border-2 border-gray-300 cursor-move">
            {title ? (
              <div className="flex justify-center h-full">
                <span className="h-full px-2 text-[11px] flex items-center font-chicago text-black bg-gray-100">
                  {title}
                </span>
              </div>
            ) : null}
          </div>

          {/* Dialog content */}
          <div className="p-4">
            <div className="flex items-start space-x-4">
              {icon ? (
                <img
                  src={icon}
                  alt={imageAlt}
                  className="flex-shrink-0 w-8 h-8"
                />
              ) : null}
              <div className="text-[11px] font-chicago">{message}</div>
            </div>
          </div>

          {/* Dialog buttons */}
          <div className="flex justify-end p-2 space-x-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`px-5 py-0 text-[11px] font-chicago border-2 border-black rounded-md ${
                  button.primary ? 'bg-black text-white' : ''
                }`}
                onClick={() => {
                  button.onClick();
                  closeDialog();
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Dialog;
