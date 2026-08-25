import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  confirmType = 'primary',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getConfirmBtnClass = () => {
    switch (confirmType) {
      case 'danger':
        return 'bg-[#ff4d4f] hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-[#fa8c16] hover:bg-orange-600 text-white';
      case 'success':
        return 'bg-[#52c41a] hover:bg-green-600 text-white';
      case 'primary':
      default:
        return 'bg-[#1677ff] hover:bg-blue-600 text-white';
    }
  };

  const getIcon = () => {
    switch (confirmType) {
      case 'danger':
        return <i className="fa-solid fa-triangle-exclamation text-[#ff4d4f] text-xl mr-3 mt-0.5"></i>;
      case 'warning':
        return <i className="fa-solid fa-circle-exclamation text-[#fa8c16] text-xl mr-3 mt-0.5"></i>;
      case 'success':
        return <i className="fa-solid fa-circle-check text-[#52c41a] text-xl mr-3 mt-0.5"></i>;
      default:
        return <i className="fa-solid fa-circle-question text-[#1677ff] text-xl mr-3 mt-0.5"></i>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-md shadow-2xl w-[480px] max-w-[90vw] overflow-hidden border border-[#e8e8e8] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 pt-5 pb-2 flex items-start">
          {getIcon()}
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
            <div className="mt-2 text-xs text-gray-600 leading-relaxed">
              {content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-[#f0f0f0] flex justify-end space-x-2.5 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 border border-[#d9d9d9] bg-white text-gray-700 rounded-sm text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-sm text-xs transition-colors cursor-pointer shadow-xs ${getConfirmBtnClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
