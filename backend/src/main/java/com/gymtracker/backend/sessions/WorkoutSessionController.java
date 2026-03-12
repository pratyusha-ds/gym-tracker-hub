package com.gymtracker.backend.sessions;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class WorkoutSessionController {

    private final WorkoutSessionService sessionService;

    @GetMapping
    public List<WorkoutSessionDTO> getHistory() {
        return sessionService.getMySessions();
    }

    @PostMapping
    public WorkoutSessionDTO startSession() {
        return sessionService.createSession();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}