import React from 'react';

interface DialogProps {
  title?: string;
  message: string;
  icon?: string;
  buttons?: Array<{
    label: string;
    onClick: () => void;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  message,
  icon = '/icons/alert.png',
  buttons = [{ label: 'OK', onClick: () => {}, primary: true }],
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-999 bg-opacity-30">
      <div className="bg-white border border-black shadow-md w-80">
        {/* Dialog header */}
        <div className="h-5 bg-[url('/icons/titlebar.png')] bg-repeat border-2 border-gray-300">
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
              <img src={icon} alt="Alert" className="flex-shrink-0 w-8 h-8" />
            ) : null}
            <p className="text-[11px] font-chicago">{message}</p>
          </div>
        </div>

        {/* Dialog buttons */}
        <div className="flex justify-end p-2 space-x-2 ">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`px-5 py-0 text-[11px] font-chicago border-2 border-black rounded-md`}
              onClick={() => {
                button.onClick();
                onClose();
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
