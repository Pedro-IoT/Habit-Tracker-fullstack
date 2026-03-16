import { useNavigate, Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import GoogleButton from '@/components/GoogleButton/GoogleButton';
import {
  handleSubmitRegister,
  handleRegister,
} from '@/features/auth/api/authService';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationKey: ['register'],
    mutationFn: handleRegister,
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Registration failed');
    },
  });

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Start Your Journey</h2>
        <p className={styles.registerDescription}>
          Create an account and build habits that stick.
        </p>
        <form
          onSubmit={e => {
            const dataOrError = handleSubmitRegister(e);
            if (dataOrError instanceof Error) {
              toast.error('Invalid registration data');
              return;
            }
            mutation.mutate(dataOrError);
          }}
          className={styles.registerForm}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" placeholder="Name" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="******"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(showPassword => !showPassword)}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={styles.registerButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className={styles.separator}>
          <span>continue with</span>
        </div>

        <div className={styles.alternativeButtonGroup}>
          <GoogleButton />
        </div>

        <div className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
