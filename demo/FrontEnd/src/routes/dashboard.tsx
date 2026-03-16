import { apiFetch } from '../lib/apiClient';
import { createFileRoute, redirect } from '@tanstack/react-router';
import HabitDashboard from '@/features/habits/components/Dashboard/HabitDashboard';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      await apiFetch('/me', { method: 'GET' });
    } catch (error) {
      throw redirect({ to: '/login' });
    }
  },
  component: HabitsPage,
});

function HabitsPage() {
  return <HabitDashboard />;
}
