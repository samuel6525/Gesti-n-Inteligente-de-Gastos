
import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from './icons';
import { useI18n } from '../context/i18n';

interface ToastProps {
  messageKey: string;
  type: 'success' | 'error';
  show: boolean;
}

const toastConfig = {
  success: {
    bgColor: 'bg-kimi-green',
    icon: <CheckCircleIcon className="h-6 w-6 mr-3" />,
  },
  error: {
    bgColor: 'bg-red-500',
    icon: <ExclamationCircleIcon className="h-6 w-6 mr-3" />,
  },
};

const Toast: React.FC<ToastProps> = ({ messageKey, type, show }) => {
  const { t } = useI18n();
  
  if (!show) return null;

  const config = toastConfig[type];

  return (
    <div
      className={`fixed bottom-5 right-5 ${config.bgColor} text-white py-3 px-5 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-up`}
      role="alert"
      aria-live="assertive"
    >
      {config.icon}
      <p>{t(messageKey)}</p>
    </div>
  );
};

export default Toast;
