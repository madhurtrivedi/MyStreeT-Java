package com.mystreet.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Shape ─────────────────────────────────────────────────────────────────

    record ErrorResponse(
            Instant timestamp,
            String path,
            String error,
            String message
    ) {}

    // ── Handlers ─────────────────────────────────────────────────────────────

    /** Bean validation errors (@Valid) → 400 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        return build(HttpStatus.BAD_REQUEST, request.getRequestURI(),
                "VALIDATION_ERROR", message);
    }

    /** Duplicate email → 409 */
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(
            ConflictException ex, HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, request.getRequestURI(),
                "CONFLICT", ex.getMessage());
    }

    /** Wrong credentials → 401 */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            UnauthorizedException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, request.getRequestURI(),
                "UNAUTHORIZED", ex.getMessage());
    }

    /** Resource not found → 404 */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, request.getRequestURI(),
                "NOT_FOUND", ex.getMessage());
    }

    /** Catch-all → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI(),
                "INTERNAL_ERROR", "An unexpected error occurred");
    }

    // ── Util ─────────────────────────────────────────────────────────────────

    private ResponseEntity<ErrorResponse> build(
            HttpStatus status, String path, String error, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(Instant.now(), path, error, message));
    }
}
