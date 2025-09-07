

import React from 'react';
import { WarningIcon } from './icons';
import Modal from './Modal';
import { useI18n } from '../context/i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleKey: string;
  messageKey: string;
  messageOptions?: { [key: string]: string | number };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, titleKey, messageKey, messageOptions }) => {
  const { t } = useI18n();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center">
        <WarningIcon />
        <h2 id="confirmation-title" className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t(titleKey)}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t(messageKey, messageOptions)}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
          >
            {t('modals.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            {t('modals.confirmDelete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;