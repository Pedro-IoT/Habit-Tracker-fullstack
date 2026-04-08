import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import {
  createHabit,
  getCompletedDates,
  listHabit,
  deleteHabit,
  patchHabit,
  ScheduledDays,
  getHabitsByDate,
} from '../api/habitService';
import { toast } from 'react-toastify';

export const useHabits = () => {
  const {
    data: allHabits,
    isLoading: isLoadingHabits,
    error,
  } = useQuery({
    queryKey: ['listHabit'],
    queryFn: listHabit,
  });

  return {
    habits: allHabits?.filter(h => !h.checkedToday) || [],
    completedHabits: allHabits?.filter(h => h.checkedToday) || [],
    isLoadingHabits,
    error,
  };
};

export const useCompletedDates = () => {
  const {
    data: completedDates,
    isLoading: isLoadingCompletedDates,
    error,
  } = useQuery({
    queryKey: ['getCompletedDates'],
    queryFn: getCompletedDates,
  });

  return {
    DateCompletions:
      completedDates?.map(h => ({
        dateCompletions: h.dateCompletions,
        color: h.color,
      })) || [],
    isLoadingCompletedDates,
    error,
  };
};

export const useCreateHabits = () => {
  const queryClient = useQueryClient();
  const createHabitMutation = useMutation({
    mutationFn: ({
      name,
      color,
      scheduledDays,
    }: {
      name: string;
      color: string;
      scheduledDays: ScheduledDays;
    }) => createHabit(name, color, scheduledDays),
    mutationKey: ['createHabit'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabit'] });
    },
  });

  const handleCreate = async (
    name: string,
    color: string,
    scheduledDays: ScheduledDays
  ) => {
    await toast.promise(
      createHabitMutation.mutateAsync({ name, color, scheduledDays }),
      {
        pending: 'Creating habit...',
        success: 'Habit created!',
        error: 'Failed to create habit',
      }
    );
  };

  return {
    createHabit: handleCreate,
    isCreating: createHabitMutation.isPending,
  };
};

export const useDeleteHabits = () => {
  const queryClient = useQueryClient();
  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabit,
    mutationKey: ['deleteHabit'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabit'] });
    },
  });

  const handleDelete = async (id: number) => {
    await toast.promise(deleteHabitMutation.mutateAsync(id), {
      pending: 'Deleting habit...',
      success: 'Habit deleted!',
      error: 'Failed to delete habit',
    });
  };

  return {
    deleteHabit: handleDelete,
    isDeleting: deleteHabitMutation.isPending,
  };
};

export const usePatchHabits = () => {
  const queryClient = useQueryClient();
  const patchHabitMutation = useMutation({
    mutationFn: patchHabit,
    mutationKey: ['patchHabit'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listHabit'] });
      queryClient.invalidateQueries({ queryKey: ['getCompletedDates'] });
    },
  });

  const handlePatch = async (id: number) => {
    await toast.promise(patchHabitMutation.mutateAsync(id), {
      pending: 'Updating habit...',
      success: 'Habit updated!',
      error: 'Failed to update habit',
    });
  };

  return { patchHabit: handlePatch, isPatching: patchHabitMutation.isPending };
};

export const useHabitsByDate = (date?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['habitsByDate', date],
    queryFn: () => getHabitsByDate(date as string),
    enabled: !!date,
  });

  return {
    habitsByDate: data ?? [],
    isLoadingHabitsByDate: isLoading,
    habitsByDateError: error,
  };
};
