package com.habit_tracker_V2.demo.DTO.Habits;

import java.time.DayOfWeek;
import java.util.Set;

public record HabitResponseDTO(Long id, String name, String color, int streak, boolean checkedToday, Set<DayOfWeek> scheduledDays) {
}
