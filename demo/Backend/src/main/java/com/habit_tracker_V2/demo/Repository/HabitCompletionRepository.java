package com.habit_tracker_V2.demo.Repository;

import com.habit_tracker_V2.demo.Entities.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    boolean existsByHabit_IdAndCompletionDate(Long habit_id, LocalDate completion_date);
    void deleteByHabit_IdAndCompletionDate(Long habit_id, LocalDate completion_date);

    @Query("""
            select hc.completionDate
            from HabitCompletion hc
            where hc.habit.id = :habitId
            order by hc.completionDate desc
    """)
    List<LocalDate> findAllDatesDesc(Long habitId);
    void  deleteByHabit_Id(Long habitId);
}
