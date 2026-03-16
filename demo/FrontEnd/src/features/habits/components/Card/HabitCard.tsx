import { BsCheckCircle, BsFire, BsXCircle } from 'react-icons/bs';
import { useDeleteHabits, usePatchHabits } from '../../hooks/useHabits';
import { AlertModal } from '@/components/Modals/DeleteModal';
import styles from './HabitCard.module.css';

type HabitCardProps = {
  id: number;
  name: string;
  color: string;
  streak: number;
  checkedToday: boolean;
};

export default function HabitCard({
  id,
  name,
  color,
  streak,
  checkedToday,
}: HabitCardProps) {
  const { deleteHabit } = useDeleteHabits();
  const { patchHabit } = usePatchHabits();

  return (
    <div
      className={`${styles.habitCard} ${checkedToday ? styles.completedCard : ''}`}
      style={{ borderLeft: `5px solid ${color}` }}
    >
      <h3 className={styles.habitName}>{name}</h3>
      <p className={styles.habitStreak}>
        {streak} <BsFire className={styles.fireIcon} />
      </p>
      <button
        className={`${styles.habitButton} ${styles.checkButton}`}
        onClick={() => patchHabit(id)}
      >
        <BsCheckCircle className={styles.checkIcon} />
      </button>
      <AlertModal
        onAction={() => deleteHabit(id)}
        trigger={
          <button className={`${styles.habitButton} ${styles.deleteButton}`}>
            <BsXCircle className={styles.deleteIcon} />
          </button>
        }
      />
    </div>
  );
}
