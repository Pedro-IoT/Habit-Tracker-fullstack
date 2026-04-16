import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BsX } from 'react-icons/bs';
import PasskeySettings from '../PasskeySettings/PasskeySettings';
import styles from './PasskeyModal.module.css';

interface PasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasskeyModal({ isOpen, onClose }: PasskeyModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Manage Passkeys</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <BsX size={20} />
          </button>
        </div>
        <div className={styles.content}>
          <PasskeySettings />
        </div>
      </div>
    </div>,
    document.body
  );
}
