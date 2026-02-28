package com.gymtracker.backend.workoutsets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, Long> {
    List<WorkoutSet> findByExerciseId(Long exerciseId);
    
    List<WorkoutSet> findBySessionId(Long sessionId);
}