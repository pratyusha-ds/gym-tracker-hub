package com.gymtracker.backend.sessions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {

    List<WorkoutSession> findByUserClerkIdOrderByDateDesc(String clerkId);

    Optional<WorkoutSession> findByUserClerkIdAndDate(String clerkId, LocalDate date);
}