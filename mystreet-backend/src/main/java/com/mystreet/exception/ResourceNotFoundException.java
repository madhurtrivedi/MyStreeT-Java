package com.mystreet.exception;

// ── 404 Not Found ─────────────────────────────────────────────────────────────
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
