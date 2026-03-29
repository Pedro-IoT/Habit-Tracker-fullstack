package com.habit_tracker_V2.demo.Controller;

import com.habit_tracker_V2.demo.DTO.Habits.HabitCompletionDTO;
import com.habit_tracker_V2.demo.DTO.Habits.HabitCreateDTO;
import com.habit_tracker_V2.demo.DTO.Habits.HabitResponseDTO;
import com.habit_tracker_V2.demo.Services.HabitService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @PostMapping
    public ResponseEntity<HabitResponseDTO> createHabit (@RequestBody HabitCreateDTO request, Authentication authentication) {
        String userEmail = authentication.getName();

        HabitResponseDTO newHabit = habitService.createHabit(request, userEmail);

        return ResponseEntity.status(HttpStatus.CREATED).body(newHabit);
    }

    @GetMapping
    public ResponseEntity<List<HabitResponseDTO>> getAllHabits(Authentication authentication) {
        String  userEmail = authentication.getName();

        List<HabitResponseDTO> list =  habitService.getAllHabits(userEmail);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long habitId, Authentication authentication) {
        String userEmail = authentication.getName();
        boolean isDeleted = habitService.deleteHabit(userEmail, habitId);

        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{habitId}")
    public ResponseEntity<HabitResponseDTO> toggleHabit(@PathVariable Long habitId, Authentication authentication) {
        String userEmail = authentication.getName();
        HabitResponseDTO habit = habitService.toggleDoneToday(userEmail, habitId);

        if (habit != null) {
            return  ResponseEntity.status(HttpStatus.OK).body(habit);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<HabitResponseDTO>> getAllHabitByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate date,
    Authentication authentication) {

        String userEmail = authentication.getName();
        List<HabitResponseDTO> habits = habitService.getHabitsCompletedOnDate(userEmail, date);

        return ResponseEntity.status(HttpStatus.OK).body(habits);

    }

    @GetMapping("/dates")
    public ResponseEntity<List<HabitCompletionDTO>> getAllHabitDates(Authentication authentication) {
        String  userEmail = authentication.getName();
        List<HabitCompletionDTO> completionDTOS = habitService.getAllHabitsAndCompletionDates(userEmail);

        return ResponseEntity.status(HttpStatus.OK).body(completionDTOS);
    }
}
