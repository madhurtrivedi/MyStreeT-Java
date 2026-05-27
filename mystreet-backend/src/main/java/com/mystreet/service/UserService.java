package com.mystreet.service;

import com.mystreet.dto.AuthDTOs.AuthResponse;
import com.mystreet.dto.AuthDTOs.LoginRequest;
import com.mystreet.dto.AuthDTOs.RegisterRequest;
import com.mystreet.exception.ConflictException;
import com.mystreet.exception.UnauthorizedException;
import com.mystreet.model.User;
import com.mystreet.repository.UserRepository;
import com.mystreet.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ── Register ──────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Uniqueness check
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered: " + request.email());
        }

        // 2. Persist new user (isAdmin defaults to false)
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .admin(false)
                .build();

        userRepository.save(user);

        // 3. Issue token immediately so the user is logged in right after register
        String token = jwtUtil.generateToken(user.getEmail(), user.isAdmin());
        return new AuthResponse(token, user.getEmail(), user.isAdmin());
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        // 1. Look up user
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // 2. Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // 3. Issue token
        String token = jwtUtil.generateToken(user.getEmail(), user.isAdmin());
        return new AuthResponse(token, user.getEmail(), user.isAdmin());
    }
}
