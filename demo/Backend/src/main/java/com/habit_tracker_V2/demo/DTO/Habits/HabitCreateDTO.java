package com.habit_tracker_V2.demo.DTO.Habits;

import java.time.DayOfWeek;
import java.util.Set;

public record HabitCreateDTO(String name, String color, Set<DayOfWeek> scheduledDays) {
}
