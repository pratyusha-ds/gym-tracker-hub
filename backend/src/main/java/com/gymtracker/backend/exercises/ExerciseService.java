package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final CategoryRepository categoryRepository;

    private String getClerkUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        throw new RuntimeException("Unauthorized: No valid Clerk session found.");
    }

    public Exercise getExerciseById(Long id) {
        String clerkId = getClerkUserId();
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!exercise.getCategory().getUser().getClerkId().equals(clerkId)) {
            throw new RuntimeException("Unauthorized: Access denied to this exercise.");
        }
        return exercise;
    }

    public List<ExerciseDTO> searchExercises(String query) {
        return exerciseRepository.findByNameContainingIgnoreCaseAndCategoryUserClerkId(query, getClerkUserId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ExerciseDTO> getExercisesByCategory(Long categoryId) {
        return exerciseRepository.findByCategoryIdAndCategoryUserClerkId(categoryId, getClerkUserId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExerciseDTO addExercise(ExerciseController.ExerciseRequest request) {
        String clerkId = getClerkUserId();
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getClerkId().equals(clerkId)) {
            throw new RuntimeException("Unauthorized: This is not your category.");
        }

        boolean exists = category.getExercises().stream()
                .anyMatch(e -> e.getName().equalsIgnoreCase(request.name().trim()));

        if (exists) {
            throw new RuntimeException("Exercise '" + request.name() + "' already exists in " + category.getName());
        }

        Exercise saved = exerciseRepository.save(Exercise.builder()
                .name(request.name().trim())
                .category(category)
                .build());

        return mapToDTO(saved);
    }

    @Transactional
    public ExerciseDTO updateExercise(Long id, ExerciseController.ExerciseRequest request) {
        Exercise exercise = getExerciseById(id);
        exercise.setName(request.name().trim());
        return mapToDTO(exerciseRepository.save(exercise));
    }

    @Transactional
    public void deleteExercise(Long id) {
        Exercise exercise = getExerciseById(id);

        Category category = exercise.getCategory();
        if (category != null) {
            category.getExercises().remove(exercise);
        }

        exerciseRepository.delete(exercise);
    }

    public ExerciseDTO mapToDTO(Exercise exercise) {
        return new ExerciseDTO(
                exercise.getId(),
                exercise.getName(),
                exercise.getCategory().getId());
    }
}