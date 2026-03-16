import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { BsEye, BsEyeSlash, BsLock } from 'react-icons/bs';
import GoogleButton from '@/components/GoogleButton/GoogleButton';
import {
  handleLogin,
  handleSubmitLogin,
} from '@/features/auth/api/authService';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: handleLogin,
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Failed to login, please check your credentials.');
    },
  });

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Welcome Back</h2>
        <p className={styles.loginDescription}>
          Log in to keep your streak going.
        </p>
        <form
          className={styles.loginForm}
          onSubmit={e => {
            const dataOrError = handleSubmitLogin(e);
            if (dataOrError instanceof Error) {
              toast.error('Invalid login data');
              return;
            }
            mutation.mutate(dataOrError);
          }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="******"
                className={styles.passwordInput}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.separator}>
          <span>continue with</span>
        </div>

        <div className={styles.alternativeButtonGroup}>
          <button className={styles.alternativeButton} type="button">
            <BsLock className={styles.alternativeIcon} />
            Sign in with a Passkey
          </button>
          <GoogleButton />
        </div>

        <div className={styles.signupLink}>
          Don't have an account? <Link to="/register"> Sign up</Link>
        </div>
      </div>
    </div>
  );
}
