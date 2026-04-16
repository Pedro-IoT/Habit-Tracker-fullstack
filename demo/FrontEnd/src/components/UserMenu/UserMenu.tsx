import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BsPerson, BsKey, BsBoxArrowRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { apiFetch } from '@/lib/apiClient';
import PasskeyModal from '@/features/auth/components/PasskeyModal/PasskeyModal';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiFetch('/logout', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: '/login' });
    },
    onError: () => {
      toast.error('Failed to logout');
    },
  });

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const handlePasskeysClick = () => {
    setIsOpen(false);
    setIsPasskeyModalOpen(true);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logoutMutation.mutate();
  };

  return (
    <>
      <div className={styles.container} ref={containerRef}>
        <button
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <BsPerson size={20} />
        </button>

        {isOpen && (
          <div className={styles.dropdown} role="menu">
            <button
              className={styles.menuItem}
              onClick={handlePasskeysClick}
              role="menuitem"
            >
              <BsKey className={styles.menuIcon} />
              Passkeys
            </button>
            <div className={styles.divider} />
            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              role="menuitem"
            >
              <BsBoxArrowRight className={styles.menuIcon} />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      <PasskeyModal
        isOpen={isPasskeyModalOpen}
        onClose={() => setIsPasskeyModalOpen(false)}
      />
    </>
  );
}
