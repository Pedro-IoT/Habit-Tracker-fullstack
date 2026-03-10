package com.habit_tracker_V2.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HabitTrackerV2Application {

	public static void main(String[] args) {
		SpringApplication.run(HabitTrackerV2Application.class, args);
	}

}
