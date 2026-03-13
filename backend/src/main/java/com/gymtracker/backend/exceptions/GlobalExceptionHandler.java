package com.gymtracker.backend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<?> handleRepositoryError(InvalidDataAccessApiUsageException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Database Error: A required ID was missing."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception e) {
        return ResponseEntity.status(500)
                .body(Map.of("message", "Internal Server Error. Please try again later."));
    }
}