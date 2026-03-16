import { Link } from '@tanstack/react-router';
import { BsFire, BsCalendar3, BsShieldCheck } from 'react-icons/bs';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <>
      <main className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Transform your goals into
            <br />
            <span className={styles.textGradient}>unbreakable routines</span>
          </h1>
          <p className={styles.description}>
            Stop relying on motivation. Build daily constistency with our <br />
            minimalist habit tracker focused on what truly matters.
          </p>
          <div className={styles.actions}>
            <Link className={styles.registerLink} to="/register">
              Get Started
            </Link>

            <a className={styles.featuresLink} href="#features">
              How it works
            </a>
          </div>
        </div>
        <div className={styles.heroImageWrapper}>
          <div className={styles.heroImage}>
            <p>Todo: get dashboard screenshot once ready</p>
          </div>
        </div>
      </main>

      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresWrapper}>
          <h2>Why use Habit Tracker</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.cardFire}`}>
              <div className={styles.iconWrapper}>
                <BsFire className={styles.iconFire} />
              </div>
              <h3>Maintain your Streaks</h3>
              <p>
                Don't break the chain. Visualize your daily progress and keep
                momentum going.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.cardCalendar}`}>
              <div className={styles.iconWrapper}>
                <BsCalendar3 className={styles.iconCalendar} />
              </div>
              <h3>Flexible Scheduling</h3>
              <p>
                Not every habit needs to be daily. Choose especific days of the
                week to build a rotine that perfectly fits your lifestyle.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.cardShield}`}>
              <div className={styles.iconWrapper}>
                <BsShieldCheck className={styles.iconShield} />
              </div>
              <h3>Distraction Free</h3>
              <p>
                A clean, minimalist interface designed to keep you focused on
                your habits, not on the app.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
