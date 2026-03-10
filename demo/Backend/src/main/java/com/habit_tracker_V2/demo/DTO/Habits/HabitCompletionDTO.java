package com.habit_tracker_V2.demo.DTO.Habits;

import java.time.LocalDate;
import java.util.List;

public record HabitCompletionDTO(Long id, String name, String color, List<LocalDate> dateCompletions) {
}
