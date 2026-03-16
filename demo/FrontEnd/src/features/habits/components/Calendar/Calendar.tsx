import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';

interface HabitCalendarProps {
  completedDates: { color: string; dateCompletions: string[] }[];
}

export default function HabitCalendar({ completedDates }: HabitCalendarProps) {
  return (
    <div className={styles.calendarWrapper}>
      <h2>Calendar</h2>
      <Calendar
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;
          const dateStr = date.toISOString().split('T')[0];

          // Filtra quais hábitos foram concluídos nesse dia
          if (dateStr === undefined) return null;
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
