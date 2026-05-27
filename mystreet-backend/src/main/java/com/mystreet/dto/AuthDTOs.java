package com.mystreet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// ── Register ──────────────────────────────────────────────────────────────────
public class AuthDTOs {

    public record RegisterRequest(
            @Email(message = "Must be a valid email")
            @NotBlank(message = "Email is required")
            String email,

            @NotBlank(message = "Password is required")
            @Size(min = 6, message = "Password must be at least 6 characters")
            String password
    ) {}

    // ── Login ─────────────────────────────────────────────────────────────────
    public record LoginRequest(
            @Email(message = "Must be a valid email")
            @NotBlank(message = "Email is required")
            String email,

            @NotBlank(message = "Password is required")
            String password
    ) {}

    // ── Response ──────────────────────────────────────────────────────────────
    public record AuthResponse(
            String token,
            String email,
            boolean admin
    ) {}
}
