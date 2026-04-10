package com.habit_tracker_V2.demo.Services;

import com.habit_tracker_V2.demo.DTO.AI.AIRequestDTO;
import com.habit_tracker_V2.demo.DTO.AI.AIResponseDTO;
import com.habit_tracker_V2.demo.DTO.Habits.HabitResponseDTO;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@ConditionalOnProperty(name = "app.ai.enabled", havingValue = "true")
public class ServiceAI {

    private final ChatClient chatClient;
    private final HabitService habitService;

    public ServiceAI(ChatMemory chatMemory, ChatModel chatModel,  HabitService habitService) {
        this.chatClient = ChatClient.builder(chatModel)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
        this.habitService = habitService;
    }

    public AIResponseDTO suggestHabits(String userEmail, AIRequestDTO requestDTO) {
        List<HabitResponseDTO> userHabits = habitService.getAllHabits(userEmail);
        String habitsString = userHabits.toString();

        String system = """
                You are an agent that will advise users about that habits
                they have this list of habits: %s. Always be polite and respond in plain text try not to include emojis or bold letters, and try
                to solve what they're asking for, but only in a context of habits.
                If the user wants something that doesn't have anything to do with
                habits give a polite answer saying you only talk about habits. Another
                thing, respond the user in whatever languge they speak, although i'm talking
                in english the user may talk in another language. Try to be short with the answers but still polite and helpful.
                """.formatted(habitsString);

        String content = chatClient.prompt()
                .system(system)
                .advisors(a -> a
                        .param("chat_memory_conversation_id", userEmail)
                        .param("chat_memory_conversation_key", 10))
                .user(requestDTO.prompt())
                .call()
                .content();

        Long generatedId = System.currentTimeMillis();

        return new AIResponseDTO(generatedId, content);
    }
}
