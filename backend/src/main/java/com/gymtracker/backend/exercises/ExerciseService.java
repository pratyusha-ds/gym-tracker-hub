package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final CategoryRepository categoryRepository;

    public List<Exercise> searchExercises(String query) {
        return exerciseRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Exercise> getExercisesByCategory(Long categoryId) {
        return (categoryId == null) ? List.of() : exerciseRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public Exercise addExercise(ExerciseController.ExerciseRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        boolean exists = exerciseRepository.findByCategoryId(category.getId()).stream()
                .anyMatch(e -> e.getName().equalsIgnoreCase(request.name().trim()));

        if (exists) {
            throw new RuntimeException("'" + request.name() + "' already exists in " + category.getName());
        }
        return exerciseRepository.save(Exercise.builder()
                .name(request.name().trim())
                .category(category)
                .build());
    }

    @Transactional
    public Exercise updateExercise(Long id, ExerciseController.ExerciseRequest request) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(request.name().trim());
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public void deleteExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with ID: " + id));

        Category category = exercise.getCategory();
        if (category != null) {
            category.getExercises().remove(exercise);
        }

        exerciseRepository.delete(exercise);
    }
}