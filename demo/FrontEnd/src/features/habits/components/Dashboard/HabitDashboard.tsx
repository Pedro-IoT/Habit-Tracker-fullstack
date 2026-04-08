import Habitform from '../Form/HabitForm';
import HabitCard from '../Card/HabitCard';
import HabitCalendarPanel from '../Calendar/HabitCalendarPanel';
import { useHabits } from '../../hooks/useHabits';
import styles from './HabitDashboard.module.css';
import { Skeleton } from '@radix-ui/themes';
import AIChat from '@/features/AI/components/AIChat';

export default function HabitDashboard() {
  const { habits, completedHabits, isLoadingHabits, error } = useHabits();

  if (error) {
    return <p>Error loading habits: {error.message}</p>;
  }

  return (
    <div className={styles.habitDashboard}>
      <aside className={styles.leftSidebar}>
        <div className={styles.calendarCard}>
          <HabitCalendarPanel />
        </div>
      </aside>

      <main className={styles.centerColumn}>
        <section className={styles.formSection}>
          <Skeleton loading={isLoadingHabits}>
            <Habitform />
          </Skeleton>
        </section>

        <div className={styles.habitsTodo}>
          <div className={styles.habitsHeader}>
            <h2>To Do</h2>
          </div>
          <Skeleton loading={isLoadingHabits}>
            <div className={styles.habitList}>
              {habits?.length === 0 && completedHabits?.length === 0 ? (
                <p className={styles.noHabits}>
                  No habits yet. Start by creating one!
                </p>
              ) : habits?.length === 0 ? (
                <p className={styles.allDone}>All done for today!</p>
              ) : (
                habits?.map(habit => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    color={habit.color}
                    streak={habit.streak}
                    checkedToday={habit.checkedToday}
                  />
                ))
              )}
            </div>
          </Skeleton>
        </div>

        <div className={styles.doneToday}>
          <div className={styles.habitsHeader}>
            <h2>Completed</h2>
          </div>
          <Skeleton loading={isLoadingHabits}>
            <div className={styles.habitListDone}>
              {completedHabits?.length === 0 ? (
                <p className={styles.noCompleted}>
                  Nothing completed yet. Keep going!
                </p>
              ) : (
                completedHabits?.map(habit => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    color={habit.color}
                    streak={habit.streak}
                    checkedToday={habit.checkedToday}
                  />
                ))
              )}
            </div>
          </Skeleton>
        </div>
      </main>

      <aside className={styles.rightSidebar}>
        <div className={styles.aiCard}>
          <AIChat />
        </div>
      </aside>
    </div>
  );
}
