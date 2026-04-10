package com.habit_tracker_V2.demo.Services;

import org.springframework.http.ResponseCookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CookieService {
    private static final String COOKIE_NAME = "token";
    private static final int EXPIRATION_TIME = 60 * 60 * 2; // 2 hours in seconds
    private final JwtEncoder jwtEncoder;

    @Value("${app.security.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${app.security.cookie.same-site:Lax}")
    private String sameSite;

    @Value("${app.security.cookie.domain:}")
    private String cookieDomain;

    public CookieService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public ResponseCookie GenerateTokenCookie(String email) {
        String token;
        try{
            var now = Instant.now();

            var claims = JwtClaimsSet.builder()
                    .issuer("Habit Tracker Backend")
                    .subject(email)
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(EXPIRATION_TIME))
                    .build();

            token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        } catch (JwtException e) {
            throw new RuntimeException("Error while generating token", e);
        }
        return buildCookie(token, EXPIRATION_TIME);
    }

    public ResponseCookie GetCleanCookie() {
        return buildCookie("", 0);
    }

    private ResponseCookie buildCookie(String value, long maxAge) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .maxAge(maxAge)
                .sameSite(sameSite);

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            builder.domain(cookieDomain);
        }

        return builder.build();
    }
}
