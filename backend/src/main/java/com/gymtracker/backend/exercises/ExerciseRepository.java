package com.gymtracker.backend.exercises;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByNameContainingIgnoreCaseAndCategoryUserClerkId(String name, String clerkId);

    List<Exercise> findByCategoryIdAndCategoryUserClerkId(Long categoryId, String clerkId);
}