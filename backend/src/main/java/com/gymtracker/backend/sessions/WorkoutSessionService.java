package com.gymtracker.backend.sessions;

import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import com.gymtracker.backend.workoutsets.WorkoutSetDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutSessionService {

    private final WorkoutSessionRepository sessionRepository;
    private final UserRepository userRepository;

    private String getClerkUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        throw new RuntimeException("Unauthorized: No valid Clerk token found.");
    }

    public List<WorkoutSessionDTO> getMySessions() {
        return sessionRepository.findByUserClerkIdOrderByDateDesc(getClerkUserId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkoutSessionDTO createSession() {
        User user = userRepository.findByClerkId(getClerkUserId())
                .orElseThrow(() -> new RuntimeException("User not found. Sync required."));

        WorkoutSession session = WorkoutSession.builder().user(user).build();
        WorkoutSession savedSession = sessionRepository.save(session);

        return convertToDTO(savedSession);
    }

    @Transactional
    public void deleteSession(Long id) {
        WorkoutSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getClerkId().equals(getClerkUserId())) {
            throw new RuntimeException("Unauthorized: Access denied.");
        }
        sessionRepository.delete(session);
    }

    private WorkoutSessionDTO convertToDTO(WorkoutSession session) {
        List<WorkoutSetDTO> setDTOs = session.getSets().stream()
                .map(set -> new WorkoutSetDTO(
                        set.getId(),
                        set.getWeight(),
                        set.getReps(),
                        set.getExercise().getName(),
                        set.getExercise().getId(),
                        session.getDate().toString()))
                .collect(Collectors.toList());

        return new WorkoutSessionDTO(session.getId(), session.getDate(), setDTOs);
    }
}