import styles from './GoogleButton.module.css';
import googleIcon from './icons/google-logo-9822.png';

export default function GoogleButton() {
  return (
    <a
      href="http://localhost:8080/oauth2/authorization/google"
      className={`${styles.alternativeButton} ${styles.googleButton}`}
    >
      <img src={googleIcon} alt="" className={styles.googleLogo} />
      Continue with Google
    </a>
  );
}
