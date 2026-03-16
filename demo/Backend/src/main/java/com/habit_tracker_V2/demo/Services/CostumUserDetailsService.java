package com.habit_tracker_V2.demo.Services;

import com.habit_tracker_V2.demo.Entities.User;
import com.habit_tracker_V2.demo.Repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CostumUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CostumUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public org.springframework.security.core.userdetails.@NonNull UserDetails loadUserByUsername(@NonNull String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username).orElseGet(() -> {
            try {
                UUID id = UUID.fromString(username);
                return userRepository.findById(id).orElse(null);
            } catch (IllegalArgumentException ignored) {
                return null;
            }
        });

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}
