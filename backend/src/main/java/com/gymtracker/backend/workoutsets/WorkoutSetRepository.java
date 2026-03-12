package com.gymtracker.backend.workoutsets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, Long> {

    List<WorkoutSet> findByExerciseIdAndSessionUserClerkIdOrderBySessionDateDesc(Long exerciseId, String clerkId);

    List<WorkoutSet> findBySessionDateAndSessionUserClerkId(LocalDate date, String clerkId);
}