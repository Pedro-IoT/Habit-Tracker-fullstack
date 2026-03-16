import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiClient';
import { toast } from 'react-toastify';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isHabitPage = location.pathname === '/dashboard';
  const isHomePage = location.pathname === '/';

  const mutation = useMutation({
    mutationFn: async () => {
      await apiFetch('/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: '/login' });
    },
    onError: () => {
      toast.error('Failed to logout');
    },
  });

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.headerContainer}>
        <Link
          className={styles.logoLink}
          to="/"
          disabled={mutation.isPending || isHabitPage}
        >
          <h1 className={styles.logo}>Habit Tracker</h1>
        </Link>

        <div className={styles.actions}>
          {isHomePage && (
            <>
              <Link className={styles.registerLink} to="/register">
                Register
              </Link>

              <Link className={styles.loginLink} to="/login">
                Login
              </Link>
            </>
          )}
          {isHabitPage && (
            <button
              className={styles.logoutButton}
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
