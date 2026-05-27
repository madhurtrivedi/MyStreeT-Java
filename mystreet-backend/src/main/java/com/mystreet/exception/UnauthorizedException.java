package com.mystreet.exception;

// ── 401 Unauthorized ──────────────────────────────────────────────────────────
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
