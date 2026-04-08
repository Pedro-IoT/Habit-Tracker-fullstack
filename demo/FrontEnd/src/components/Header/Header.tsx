import { Link, useLocation } from '@tanstack/react-router';
import UserMenu from '@/components/UserMenu/UserMenu';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();

  const isHabitPage = location.pathname === '/dashboard';
  const isHomePage = location.pathname === '/';

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.headerContainer}>
        <Link className={styles.logoLink} to="/" disabled={isHabitPage}>
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
          {isHabitPage && <UserMenu />}
        </div>
      </nav>
    </header>
  );
}
