package com.habit_tracker_V2.demo.Security;

import com.habit_tracker_V2.demo.Services.OAuth2Service;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Value("${app.security.webauthn.enabled:true}")
    private boolean webAuthnEnabled;

    @Value("${app.security.webauthn.rp-name:habit-tracker}")
    private String webAuthnRpName;

    @Value("${app.security.webauthn.rp-id:localhost}")
    private String webAuthnRpId;

    @Value("${app.security.cors.allowed-origins:http://localhost:8080,http://localhost:5173}")
    private List<String> allowedOrigins;

    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        return request -> {
            if (request.getCookies() == null) return null;
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName()) && cookie.getValue() != null && !cookie.getValue().isBlank()) {
                    return cookie.getValue();
                }
            }
            return null;
        };
    }

    @Bean
    protected SecurityFilterChain mySpringSecurityFilterChain(
            HttpSecurity http,
            OAuth2LoginSuccessHandler successHandler,
            OAuth2LoginFailureHandler failureHandler,
            OAuth2Service oauth2Service,
            BearerTokenResolver bearerTokenResolver
    ) throws Exception {
        HttpSecurity security = http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, "/api/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/register").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/webauthn/**").permitAll()
                        .requestMatchers("/login/webauthn").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .oauth2Login(oath2 -> oath2
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                        .userInfoEndpoint(userInfo -> userInfo.userService(oauth2Service)))
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers(
                                "/webauthn/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/actuator/**"
                        ))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(bearerTokenResolver)
                        .jwt(Customizer.withDefaults()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        if (webAuthnEnabled) {
            security.webAuthn(webAuthn -> webAuthn
                    .rpName(webAuthnRpName)
                    .rpId(webAuthnRpId));
        }

        return security.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
