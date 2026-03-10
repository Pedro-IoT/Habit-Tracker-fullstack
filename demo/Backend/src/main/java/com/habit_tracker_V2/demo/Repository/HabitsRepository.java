package com.habit_tracker_V2.demo.Repository;

import com.habit_tracker_V2.demo.Entities.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HabitsRepository extends JpaRepository<Habit, Long> {
    List<Habit> findAllByUser_Id(UUID userId);
    Optional<Habit> findByIdAndUser_Id(Long id, UUID userId);
}
