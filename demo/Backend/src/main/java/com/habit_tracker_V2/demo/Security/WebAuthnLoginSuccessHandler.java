package com.habit_tracker_V2.demo.Security;

import com.habit_tracker_V2.demo.Entities.User;
import com.habit_tracker_V2.demo.Repository.UserRepository;
import com.habit_tracker_V2.demo.Services.CookieService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class WebAuthnLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final CookieService cookieService;
    private final UserRepository userRepository;

    public WebAuthnLoginSuccessHandler(CookieService cookieService, UserRepository userRepository) {
        this.cookieService = cookieService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String principal = authentication.getName();

        User user = userRepository.findByEmail(principal)
                .orElseThrow(() -> new RuntimeException("User not found after passkey login"));

        var cookie = cookieService.GenerateTokenCookie(user.getEmail());
        response.addHeader("Set-Cookie", cookie.toString());
        response.setStatus(HttpServletResponse.SC_OK);
    }
}