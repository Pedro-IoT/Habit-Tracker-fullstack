import Habitform from '../Form/HabitForm';
import HabitCard from '../Card/HabitCard';
import Calendar from '../Calendar/Calendar';
import { BsOpenai } from 'react-icons/bs';
import { useCompletedDates, useHabits } from '../../hooks/useHabits';
import styles from './HabitDashboard.module.css';
import { Skeleton } from '@radix-ui/themes';
import { useState } from 'react';
import AIChat from '@/features/AI/components/AIChat';

export default function HabitDashboard() {
  const { habits, completedHabits, isLoadingHabits, error } = useHabits();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const {
    DateCompletions,
    isLoadingCompletedDates,
    error: completedDatesError,
  } = useCompletedDates();

  if (completedDatesError) {
    return <p>Error loading completed dates: {completedDatesError.message}</p>;
  }

  if (error) {
    return <p>Error loading habits: {error.message}</p>;
  }

  return (
    <Skeleton loading={isLoadingHabits}>
      <div className={styles.habitDashboard}>
        {/* ============ COLUNA ESQUERDA ============ */}
        <div className={styles.habitsContent}>
          <Habitform />
          <div className={styles.habitsContainer}>
            <div className={styles.habitsTodo}>
              <div className={styles.habitsHeader}>
                <h2>To do Habits</h2>
              </div>
              <div className={styles.habitList}>
                {habits?.length === 0 && completedHabits?.length === 0 ? (
                  <p className={styles.noHabits}>
                    No habits yet. Start by creating one!
                  </p>
                ) : habits?.length === 0 ? (
                  <p className={styles.allDone}>
                    All habits completed today! Good job!
                  </p>
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
            </div>
            <div className={styles.doneToday}>
              <div className={styles.habitsHeader}>
                <h2>Habits Completed Today</h2>
              </div>
              <div className={styles.habitListDone}>
                {completedHabits?.length === 0 ? (
                  <p className={styles.noCompleted}>
                    No habits completed today. Keep going!
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
            </div>
          </div>

          {/* ↓↓↓ AI MODAL AQUI DENTRO do habitsContent ↓↓↓ */}
          <div className="AImodal">
            <button
              className={styles.aiButton}
              onClick={() => setIsAIModalOpen(true)}
            >
              <BsOpenai className={styles.aiIcon} />
            </button>
            {isAIModalOpen && (
              <div className={styles.aiModal}>
                <div className={styles.aiModalContent}>
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsAIModalOpen(false)}
                  >
                    &times;
                  </button>
                  <AIChat />
                </div>
              </div>
            )}
          </div>
          {/* ↑↑↑ fim do AI modal ↑↑↑ */}
        </div>
        {/* ============ FIM COLUNA ESQUERDA ============ */}

        {/* ============ COLUNA DIREITA (CALENDÁRIO) ============ */}
        <div className={styles.calendarSidebar}>
          <Calendar completedDates={DateCompletions} />
        </div>
      </div>
    </Skeleton>
  );
}
