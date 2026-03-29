package com.habit_tracker_V2.demo.Services;

import com.habit_tracker_V2.demo.DTO.Habits.HabitCompletionDTO;
import com.habit_tracker_V2.demo.DTO.Habits.HabitCreateDTO;
import com.habit_tracker_V2.demo.DTO.Habits.HabitResponseDTO;
import com.habit_tracker_V2.demo.Entities.Habit;
import com.habit_tracker_V2.demo.Entities.HabitCompletion;
import com.habit_tracker_V2.demo.Entities.User;
import com.habit_tracker_V2.demo.Repository.HabitCompletionRepository;
import com.habit_tracker_V2.demo.Repository.HabitsRepository;
import com.habit_tracker_V2.demo.Repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class HabitService {
    private final HabitsRepository habitsRepository;
    private final UserRepository userRepository;
    private final HabitCompletionRepository habitCompletionRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public HabitService(UserRepository userRepository, HabitsRepository habitsRepository,  HabitCompletionRepository habitCompletionRepository) {
        this.userRepository = userRepository;
        this.habitsRepository = habitsRepository;
        this.habitCompletionRepository = habitCompletionRepository;
    }

    private User findUserByEmail (String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }
    private boolean isDoneOnDate(Long habitId, LocalDate date) {
        return habitCompletionRepository.existsByHabit_IdAndCompletionDate(habitId, date);
    }
    private int computeStreak(Long habitId, LocalDate referenceDate, Set<DayOfWeek> scheduledDays) {
        List<LocalDate> dates = habitCompletionRepository.findAllDatesDesc(habitId);
        Set<LocalDate> completions = new HashSet<>(dates);
        if (scheduledDays == null ||  scheduledDays.isEmpty()) {
            scheduledDays = Set.of(DayOfWeek.values());
        }

        int streak = 0;
        LocalDate currentDate = referenceDate;

        if(scheduledDays.contains(referenceDate.getDayOfWeek())) {
            if(completions.contains(currentDate)) {
                streak++;
            }
        }
        currentDate = currentDate.minusDays(1);
        while(true){
            while(!scheduledDays.contains(currentDate.getDayOfWeek())) {
                currentDate = currentDate.minusDays(1);
            }
            if(completions.contains(currentDate)) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else  {
                break;
            }
        }

        return streak;
    }

    @Transactional
    public HabitResponseDTO createHabit(HabitCreateDTO habitCreateDTO, String email) {
        User user = findUserByEmail(email);
        Habit habit = new Habit();

        habit.setTitle(habitCreateDTO.name());
        habit.setColor(habitCreateDTO.color());
        habit.setScheduledDays(habitCreateDTO.scheduledDays());
        habit.setUser(user);
        habit.setStreak(0); //Every habit starts with a 0 streak, if it's been created it's not possible to have a streak
        habit = habitsRepository.save(habit);

        return new HabitResponseDTO(habit.getId(), habit.getTitle(), habit.getColor(), habit.getStreak(), false,  habit.getScheduledDays());
    }

    public List<HabitResponseDTO> getAllHabits(String email) {
        User user = findUserByEmail(email);

        List <Habit> habits = habitsRepository.findAllByUser_Id(user.getId());

        return habits.stream()
                .map(h -> new HabitResponseDTO(
                        h.getId(),
                        h.getTitle(),
                        h.getColor(),
                        h.getStreak(),
                        isDoneOnDate(h.getId(), LocalDate.now()),
                        h.getScheduledDays()
                ))
                .toList();
    }
    public List<HabitResponseDTO> getHabitsCompletedOnDate(String email, LocalDate date) {
        User user = findUserByEmail(email);
        UUID userId = user.getId();
        List<HabitCompletion> completions = habitCompletionRepository.findAllByUserIdAndDate(userId, date);
        return completions.stream()
                .map(HabitCompletion::getHabit)
                .map(h -> new HabitResponseDTO(
                        h.getId(),
                        h.getTitle(),
                        h.getColor(),
                        h.getStreak(),
                        true,
                        h.getScheduledDays()
                ))
                .toList();
    }
    public List<HabitCompletionDTO> getAllHabitsAndCompletionDates(String email) {
        User user = findUserByEmail(email);
        List<Habit> habits = habitsRepository.findAllByUser_Id(user.getId());


        return habits.stream()
                .map(h -> new HabitCompletionDTO(
                        h.getId(),
                        h.getTitle(),
                        h.getColor(),
                        habitCompletionRepository.findAllDatesDesc(h.getId())
                ))
                .toList();
    }

    @Transactional
    public boolean deleteHabit(String email, Long habitId) {
        User user = findUserByEmail(email);
        Habit habit = habitsRepository.findByIdAndUser_Id(habitId, user.getId()).orElse(null);
        if (habit == null) {
            return false;
        }
        habitCompletionRepository.deleteByHabit_Id(habitId);
        habitsRepository.delete(habit);
        return true;
    }

    @Transactional
    public HabitResponseDTO toggleDoneToday (String email, Long habitId) {
        User user = findUserByEmail(email);
        Habit habit = habitsRepository.findByIdAndUser_Id(habitId, user.getId())
                .orElseThrow( () -> new RuntimeException("Habit not found for this user"));

        LocalDate today = LocalDate.now();

        boolean doneToday = habitCompletionRepository.existsByHabit_IdAndCompletionDate(habitId, today);

        if(!doneToday) {
            habitCompletionRepository.save(new HabitCompletion(habit, today));
        }
        else {
            habitCompletionRepository.deleteByHabit_IdAndCompletionDate(habitId, today);
        }

        int streak = computeStreak(habitId, today, habit.getScheduledDays());
        habit.setStreak(streak);
        habitsRepository.save(habit);

        boolean nowDoneToday = habitCompletionRepository.existsByHabit_IdAndCompletionDate(habitId, today);

        return new HabitResponseDTO(habit.getId(), habit.getTitle(), habit.getColor(), streak, nowDoneToday, habit.getScheduledDays());
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void ResetBrokenStreaks() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        DayOfWeek dayOfWeekYesterday = yesterday.getDayOfWeek();

        List<Habit> allHabits = habitsRepository.findAll();
        for (Habit habit : allHabits) {
            Set<DayOfWeek> scheduledDays = habit.getScheduledDays();
            if (scheduledDays == null || scheduledDays.isEmpty()) {
                scheduledDays = Set.of(DayOfWeek.values());
            }

            if (scheduledDays.contains(dayOfWeekYesterday)) {
                boolean wasCompleted = habitCompletionRepository.existsByHabit_IdAndCompletionDate(habit.getId(), yesterday);
                if (!wasCompleted && habit.getStreak() > 0) {
                    habit.setStreak(0);
                    habitsRepository.save(habit);
                }
            }
        }
    }
}
