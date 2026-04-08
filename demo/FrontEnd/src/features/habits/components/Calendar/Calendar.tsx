import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';

interface HabitCalendarProps {
  completedDates: { color: string; dateCompletions: string[] }[];
  onSelectDate?: (date: string) => void;
}

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HabitCalendar({
  completedDates,
  onSelectDate,
}: HabitCalendarProps) {
  return (
    <div className={styles.calendarWrapper}>
      <h2>Calendar</h2>
      <Calendar
        onClickDay={date => onSelectDate?.(formatLocalDate(date))}
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;
          const dateStr = formatLocalDate(date);

          const habitsOnDay = completedDates.filter(h =>
            h.dateCompletions.includes(dateStr)
          );

          if (habitsOnDay.length === 0) return null;

          return (
            <div className={styles.dotsContainer}>
              {habitsOnDay.map((habit, i) => (
                <span
                  key={i}
                  className={styles.dot}
                  style={{ backgroundColor: habit.color }}
                />
              ))}
            </div>
          );
        }}
        showNeighboringMonth={false}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        minDetail="month"
        locale="en-US"
      />
    </div>
  );
}
