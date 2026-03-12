package com.gymtracker.backend.workoutsets;

public record WorkoutSetDTO(
                Long id,
                Double weight,
                Integer reps,
                String exerciseName,
                Long exerciseId,
                String date) {
}