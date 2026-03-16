package com.habit_tracker_V2.demo.Controller;

import com.habit_tracker_V2.demo.DTO.Authentication.LoginRequest;
import com.habit_tracker_V2.demo.DTO.Authentication.LoginResponse;
import com.habit_tracker_V2.demo.DTO.Authentication.RegisterRequest;
import com.habit_tracker_V2.demo.Services.CookieService;
import com.habit_tracker_V2.demo.Services.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class AuthenticationController {
    private final UserService userService;
    private final CookieService cookieService;

    public AuthenticationController(UserService userService, CookieService cookieService) {
        this.userService = userService;
        this.cookieService = cookieService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = userService.handleLogin(loginRequest);
        ResponseCookie cookie = cookieService.GenerateTokenCookie(loginRequest.email());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = cookieService.GetCleanCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest) {
        LoginResponse loginResponse = userService.handleRegister(registerRequest);
        ResponseCookie cookie = cookieService.GenerateTokenCookie(registerRequest.email());

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse);
    }
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(Authentication authentication) {
        return ResponseEntity.ok(userService.handleMe(authentication.getName()));
    }
}
