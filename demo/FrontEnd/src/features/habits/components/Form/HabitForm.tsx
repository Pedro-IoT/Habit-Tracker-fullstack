import { useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { useCreateHabits } from '../../hooks/useHabits';
import { toast } from 'react-toastify';
import styles from './HabitForm.module.css';
import { DayOfWeek, ScheduledDays } from '../../api/habitService';
import ColorPicker from '@/components/ColorPicker/ColorPicker';

const DAYS: { label: string; value: DayOfWeek }[] = [
  { label: 'M', value: 'MONDAY' },
  { label: 'T', value: 'TUESDAY' },
  { label: 'W', value: 'WEDNESDAY' },
  { label: 'T', value: 'THURSDAY' },
  { label: 'F', value: 'FRIDAY' },
  { label: 'S', value: 'SATURDAY' },
  { label: 'S', value: 'SUNDAY' },
];

export default function HabitForm() {
  const [newHabitName, setNewHabitName] = useState('');
  const [habitColor, setHabitColor] = useState('#03a9f4');
  const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>([]);
  const { createHabit, isCreating } = useCreateHabits();

  const toggleDay = (day: DayOfWeek) => {
    setScheduledDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      toast.error('Habit name cannot be empty');
      return;
    }
    if (scheduledDays.length === 0) {
      toast.error('Please select at least one scheduled day');
      return;
    }
    await createHabit(newHabitName, habitColor, scheduledDays as ScheduledDays);
    setNewHabitName('');
  };

  return (
    <div className={styles.createHabit}>
      <div className={styles.habitsHeader}>
        <h2>Create New Habit</h2>
      </div>
      <form className={styles.habitForm} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <input
            className={styles.habitInput}
            type="text"
            placeholder="New Habit"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
          />
          <div className={styles.daysContainer}>
            {DAYS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                // TODO: Media Query needed here to adjust size of day buttons
                className={`${styles.dayButton} ${scheduledDays.includes(value) ? styles.dayButtonActive : ''}`}
                onClick={() => toggleDay(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.inputRow}>
          <label className={styles.colorLabel}>Color:</label>
          {/* TODO: Media Query needed here */}
          <ColorPicker color={habitColor} setColor={setHabitColor} />

          <button
            className={styles.habitButton}
            type="submit"
            disabled={isCreating}
          >
            <BsPlusCircle className={styles.addButton} />
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
