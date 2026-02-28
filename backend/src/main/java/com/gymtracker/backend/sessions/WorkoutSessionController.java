package com.gymtracker.backend.sessions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class WorkoutSessionController {

    @Autowired
    private WorkoutSessionService sessionService;

    @GetMapping
    public List<WorkoutSession> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @PostMapping
    public WorkoutSession startSession() {
        return sessionService.createSession();
    }
}