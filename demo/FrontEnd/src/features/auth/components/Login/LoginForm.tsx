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
import {
  usePasskeyAuthentication,
  usePasskeySupport,
} from '@/features/auth/hooks/usePasskey';
import styles from './LoginForm.module.css';

const PASSKEY_PROMPT_KEY = 'hasSeenPasskeyPrompt';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isPasskeySupported = usePasskeySupport();
  const { authenticate, isAuthenticating } = usePasskeyAuthentication();

  const showPasskeyPromptIfNeeded = () => {
    const hasSeenPrompt = localStorage.getItem(PASSKEY_PROMPT_KEY);
    if (!hasSeenPrompt && isPasskeySupported) {
      localStorage.setItem(PASSKEY_PROMPT_KEY, 'true');
      toast.info('Tip: Add a passkey for faster sign-in! Click your profile icon to set one up.', {
        autoClose: 6000,
      });
    }
  };

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: handleLogin,
    onSuccess: () => {
      showPasskeyPromptIfNeeded();
      navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Failed to login, please check your credentials.');
    },
  });

  const handlePasskeyLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      toast.success('Welcome back!');
      navigate({ to: '/dashboard' });
    } else if (result.error?.type !== 'CANCELLED_BY_USER') {
      toast.error(result.error?.message || 'Passkey authentication failed');
    }
  };

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
          {isPasskeySupported && (
            <button
              className={styles.alternativeButton}
              type="button"
              onClick={handlePasskeyLogin}
              disabled={isAuthenticating}
            >
              <BsLock className={styles.alternativeIcon} />
              {isAuthenticating
                ? 'Authenticating...'
                : 'Sign in with a Passkey'}
            </button>
          )}
          <GoogleButton />
        </div>

        <div className={styles.signupLink}>
          Don't have an account? <Link to="/register"> Sign up</Link>
        </div>
      </div>
    </div>
  );
}
