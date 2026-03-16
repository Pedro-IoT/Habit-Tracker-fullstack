import { Link } from '@tanstack/react-router';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <h2 className={styles.gradientText}>Habit Tracker</h2>
            <p>
              Building better habits, one day at a time. A fullstack project
              focused on modern web development.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4>Developer</h4>
              <a
                href="https://github.com/Pedro-IoT"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repo
              </a>
              <a
                href="https://www.linkedin.com/in/pedro-io/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <Link to="/about">Tech Stack</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#">Pricing (It's Free!)</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>
            &copy; {new Date().getFullYear()} Habit Tracker. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
