package com.moneyquest.auth;

import com.moneyquest.api.dto.ApiDtos.AuthResponse;
import com.moneyquest.api.dto.ApiDtos.LoginRequest;
import com.moneyquest.api.dto.ApiDtos.RegisterRequest;
import com.moneyquest.api.dto.ApiDtos.UserResponse;
import com.moneyquest.entities.UserEntity;
import com.moneyquest.exceptions.ApiException;
import com.moneyquest.repositories.UserRepository;
import com.moneyquest.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository; this.passwordEncoder = passwordEncoder; this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with that email already exists.", "EMAIL_IN_USE");
        }
        UserEntity user = new UserEntity(UUID.randomUUID().toString(), email, passwordEncoder.encode(request.password()), Instant.now());
        userRepository.save(user);
        return issue(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
            .orElseThrow(() -> invalidCredentials());
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) throw invalidCredentials();
        return issue(user);
    }

    private AuthResponse issue(UserEntity user) {
        JwtService.IssuedToken token = jwtService.issue(user.getId(), "user");
        return new AuthResponse(token.value(), "Bearer", token.expiresAt(), new UserResponse(user.getId(), user.getEmail()));
    }

    private ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.", "INVALID_CREDENTIALS");
    }

    private String normalizeEmail(String email) { return email.trim().toLowerCase(Locale.ROOT); }
}
