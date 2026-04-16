import { useState } from 'react';
import { Button, Skeleton } from '@radix-ui/themes';
import Calendar from './Calendar';
import { useCompletedDates, useHabitsByDate } from '../../hooks/useHabits';
import styles from './HabitCalendarPanel.module.css';

type CalendarViewMode = 'month' | 'day';

export default function HabitCalendarPanel() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  const formatDisplayDate = (date: string) => {
    const [, month, day] = date.split('-');
    return `${month}/${day}`;
  };

  const {
    DateCompletions,
    isLoadingCompletedDates,
    error: completedDatesError,
  } = useCompletedDates();

  const { habitsByDate, isLoadingHabitsByDate, habitsByDateError } =
    useHabitsByDate(selectedDate ?? undefined);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleBackToCalendar = () => {
    setViewMode('month');
  };

  if (completedDatesError) {
    return <p>Error loading completed dates: {completedDatesError.message}</p>;
  }

  return (
    <div className={styles.panel}>
      {viewMode === 'month' ? (
        <Skeleton loading={isLoadingCompletedDates}>
          <Calendar
            completedDates={DateCompletions}
            onSelectDate={handleSelectDate}
          />
        </Skeleton>
      ) : (
        <div className={styles.dayView}>
          <div className={styles.dayViewHeader}>
            <Button variant="soft" color="gray" onClick={handleBackToCalendar}>
              Back
            </Button>
            <h3 className={styles.dayTitle}>
              {selectedDate
                ? `Habits on ${formatDisplayDate(selectedDate)}`
                : 'Day details'}
            </h3>
          </div>

          {selectedDate === null ? (
            <p className={styles.helperText}>Select a date on the calendar.</p>
          ) : habitsByDateError ? (
            <p className={styles.helperText}>
              Error loading habits for {formatDisplayDate(selectedDate)}:{' '}
              {habitsByDateError.message}
            </p>
          ) : (
            <Skeleton loading={isLoadingHabitsByDate}>
              {habitsByDate.length === 0 ? (
                <p className={styles.helperText}>
                  No completed habits for this day.
                </p>
              ) : (
                <div className={styles.historyList}>
                  {habitsByDate.map(habit => (
                    <div key={habit.id} className={styles.historyItem}>
                      <span
                        className={styles.colorDot}
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className={styles.habitName}>{habit.name}</span>
                      <span className={styles.streak}>{habit.streak}</span>
                    </div>
                  ))}
                </div>
              )}
            </Skeleton>
          )}
        </div>
      )}
    </div>
  );
}
