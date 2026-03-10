package com.habit_tracker_V2.demo.Config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    @Bean
    public ChatMemory chatMemory() {
        InMemoryChatMemoryRepository memoryRepository = new InMemoryChatMemoryRepository();

        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(memoryRepository)
                .maxMessages(10)
                .build();
    }
}
