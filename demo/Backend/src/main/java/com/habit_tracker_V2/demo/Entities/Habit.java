package com.habit_tracker_V2.demo.Entities;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.util.Set;

@Entity
@Table(name = "tb_habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false, name = "habit_id")
    private Long id;

    @Column(nullable = false, name = "title")
    private String title;

    @Column(name = "streak")
    private int streak;

    @Column(name = "color")
    private String color;

    @ElementCollection(targetClass = DayOfWeek.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "habit_days", joinColumns = @JoinColumn(name = "habit_id"))
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "day_of_week")
    private Set<DayOfWeek> scheduledDays;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Habit() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<DayOfWeek> getScheduledDays() {
        return scheduledDays;
    }

    public void setScheduledDays(Set<DayOfWeek> scheduledDays) {
        this.scheduledDays = scheduledDays;
    }
}
