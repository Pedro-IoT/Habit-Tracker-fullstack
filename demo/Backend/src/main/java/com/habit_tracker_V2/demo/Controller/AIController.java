package com.habit_tracker_V2.demo.Controller;

import com.habit_tracker_V2.demo.DTO.AI.AIRequestDTO;
import com.habit_tracker_V2.demo.DTO.AI.AIResponseDTO;
import com.habit_tracker_V2.demo.Services.ServiceAI;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("/api")
@RestController
@ConditionalOnProperty(name = "app.ai.enabled", havingValue = "true")
public class AIController {
    private final ServiceAI serviceAI;

    public AIController(ServiceAI serviceAI) {
        this.serviceAI = serviceAI;
    }

    @PostMapping("/AIsuggestion")
    public ResponseEntity<AIResponseDTO> getAiSuggestion (@RequestBody AIRequestDTO prompt, Authentication authentication) {
        AIResponseDTO response = serviceAI.suggestHabits(authentication.getName(), prompt);

        return ResponseEntity.ok().body(response);
    }
}
