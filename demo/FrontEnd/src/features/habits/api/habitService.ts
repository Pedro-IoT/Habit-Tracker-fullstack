import { apiFetch } from '@/lib/apiClient';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
export type ScheduledDays = [DayOfWeek, ...DayOfWeek[]];

export type Habit = {
  id: number;
  name: string;
  color: string;
  streak: number;
  checkedToday: boolean;
  scheduledDays: ScheduledDays;
};

export const createHabit = (
  name: string,
  color: string,
  scheduledDays: ScheduledDays
) => {
  return apiFetch<Habit>('/habits', {
    method: 'POST',
    body: JSON.stringify({ name, color, scheduledDays }),
  });
};

export const listHabit = () => {
  return apiFetch<Habit[]>('/habits', {
    method: 'GET',
  });
};

export const deleteHabit = (id: number) => {
  return apiFetch<void>(`/habits/${id}`, {
    method: 'DELETE',
  });
};

export const patchHabit = (id: number) => {
  return apiFetch<Habit>(`/habits/${id}`, {
    method: 'PATCH',
  });
};

export const getCompletedDates = () => {
  type CompletedDatesResponse = {
    id: number;
    name: string;
    color: string;
    dateCompletions: string[];
  };
  return apiFetch<CompletedDatesResponse[]>('/habits/dates', {
    method: 'GET',
  });
};
