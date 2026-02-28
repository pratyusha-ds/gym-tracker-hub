package com.gymtracker.backend.sessions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutSessionService {

    private final WorkoutSessionRepository sessionRepository;

    public List<WorkoutSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Transactional
    public WorkoutSession createSession() {
        return sessionRepository.save(new WorkoutSession());
    }
    
    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new RuntimeException("Session not found");
        }
        sessionRepository.deleteById(id);
    }
}