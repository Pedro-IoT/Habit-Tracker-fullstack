package com.habit_tracker_V2.demo.Security;

import com.habit_tracker_V2.demo.Services.CookieService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final CookieService cookieService;

    public OAuth2LoginSuccessHandler(CookieService cookieService) {
        this.cookieService = cookieService;
    }

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        assert oAuth2User != null;
        String email = oAuth2User.getAttribute("email");
        var cookie = cookieService.GenerateTokenCookie(email);
        response.addHeader("Set-Cookie", cookie.toString());
        response.sendRedirect("/dashboard");

    }
}
