package com.habit_tracker_V2.demo.Services;

import com.habit_tracker_V2.demo.DTO.Authentication.LoginRequest;
import com.habit_tracker_V2.demo.DTO.Authentication.LoginResponse;
import com.habit_tracker_V2.demo.DTO.Authentication.RegisterRequest;
import com.habit_tracker_V2.demo.Entities.User;
import com.habit_tracker_V2.demo.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse handleLogin(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.email()).orElse(null);
        if (user == null || !user.isLoginCorrect(loginRequest, passwordEncoder)) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return new LoginResponse(user.getName());
    }

    @Transactional
    public LoginResponse handleRegister(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.password());
        User newUser =  new User();
        newUser.setName(registerRequest.name());
        newUser.setEmail(registerRequest.email());
        newUser.setPassword(encodedPassword);
        userRepository.save(newUser);

        return new LoginResponse(newUser.getName());

    }
}
