package com.mystreet.service;

import com.mystreet.dto.AuthDTOs.AuthResponse;
import com.mystreet.dto.AuthDTOs.LoginRequest;
import com.mystreet.dto.AuthDTOs.RegisterRequest;
import com.mystreet.exception.ConflictException;
import com.mystreet.exception.UnauthorizedException;
import com.mystreet.model.User;
import com.mystreet.repository.UserRepository;
import com.mystreet.security.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private UserService userService;

    private static final String EMAIL    = "test@mystreet.com";
    private static final String PASSWORD = "secret123";
    private static final String TOKEN    = "mock.jwt.token";

    // ── Register Tests ────────────────────────────────────────────────────────

    @Test
    @DisplayName("register: success → returns token + email + admin=false")
    void register_success() {
        when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(PASSWORD)).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtUtil.generateToken(EMAIL, false)).thenReturn(TOKEN);

        AuthResponse response = userService.register(new RegisterRequest(EMAIL, PASSWORD));

        assertThat(response.token()).isEqualTo(TOKEN);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.admin()).isFalse();

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: duplicate email → throws ConflictException")
    void register_duplicateEmail_throws() {
        when(userRepository.existsByEmail(EMAIL)).thenReturn(true);

        assertThatThrownBy(() -> userService.register(new RegisterRequest(EMAIL, PASSWORD)))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining(EMAIL);

        verify(userRepository, never()).save(any());
    }

    // ── Login Tests ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("login: correct credentials → returns token")
    void login_success() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email(EMAIL)
                .passwordHash("hashed")
                .admin(false)
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(PASSWORD, "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(EMAIL, false)).thenReturn(TOKEN);

        AuthResponse response = userService.login(new LoginRequest(EMAIL, PASSWORD));

        assertThat(response.token()).isEqualTo(TOKEN);
        assertThat(response.email()).isEqualTo(EMAIL);
    }

    @Test
    @DisplayName("login: unknown email → throws UnauthorizedException")
    void login_unknownEmail_throws() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(new LoginRequest(EMAIL, PASSWORD)))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    @DisplayName("login: wrong password → throws UnauthorizedException")
    void login_wrongPassword_throws() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email(EMAIL)
                .passwordHash("hashed")
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(PASSWORD, "hashed")).thenReturn(false);

        assertThatThrownBy(() -> userService.login(new LoginRequest(EMAIL, PASSWORD)))
                .isInstanceOf(UnauthorizedException.class);

        verify(jwtUtil, never()).generateToken(any(), anyBoolean());
    }

    @Test
    @DisplayName("login: admin user → token carries admin=true")
    void login_adminUser_tokenHasAdminTrue() {
        User admin = User.builder()
                .id(UUID.randomUUID())
                .email(EMAIL)
                .passwordHash("hashed")
                .admin(true)
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches(PASSWORD, "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(EMAIL, true)).thenReturn(TOKEN);

        AuthResponse response = userService.login(new LoginRequest(EMAIL, PASSWORD));

        assertThat(response.admin()).isTrue();
        verify(jwtUtil).generateToken(EMAIL, true);
    }
}
