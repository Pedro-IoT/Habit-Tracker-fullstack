package com.habit_tracker_V2.demo.Services;

import org.springframework.http.ResponseCookie;
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
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .path("/")
                .maxAge(EXPIRATION_TIME)
                .sameSite("Lax")
                .build();
    }
    public ResponseCookie GetCleanCookie() {
        return ResponseCookie.from(COOKIE_NAME)
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }
}
