package com.gymtracker.backend.workoutsets;

import com.gymtracker.backend.sessions.WorkoutSession;
import com.gymtracker.backend.sessions.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor 
public class WorkoutSetService {

    private final WorkoutSetRepository workoutSetRepository;
    private final WorkoutSessionRepository sessionRepository;

    @Transactional
    public List<WorkoutSet> saveAllSets(List<WorkoutSet> sets) {
        if (sets == null || sets.isEmpty()) {
            throw new RuntimeException("No sets provided to save");
        }

        WorkoutSession savedSession = sessionRepository.save(new WorkoutSession());

        sets.forEach(set -> set.setSession(savedSession));

        return workoutSetRepository.saveAll(sets);
    }

    public List<WorkoutSet> getHistoryByExercise(Long exerciseId) {
        return workoutSetRepository.findByExerciseId(exerciseId);
    }
}