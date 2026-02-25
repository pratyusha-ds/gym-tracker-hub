package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Exercise> searchExercises(String query) {
        return exerciseRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Exercise> getExercisesByCategory(Long categoryId) {
        if (categoryId == null)
            return List.of();
        return exerciseRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public Exercise addExercise(ExerciseController.ExerciseRequest request) {
        if (request.categoryId() == null) {
            throw new RuntimeException("Cannot add exercise: Category ID is missing.");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        boolean exists = exerciseRepository.findByCategoryId(category.getId()).stream()
                .anyMatch(e -> e.getName().equalsIgnoreCase(request.name().trim()));

        if (exists) {
            throw new RuntimeException("'" + request.name() + "' already exists in " + category.getName());
        }

        Exercise exercise = new Exercise();
        exercise.setName(request.name().trim());
        exercise.setCategory(category);
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public Exercise updateExercise(Long id, ExerciseController.ExerciseRequest request) {
        if (id == null) {
            throw new RuntimeException("Exercise ID is required for update");
        }

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(request.name().trim());
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public void deleteExercise(Long id) {
        if (id == null) {
            throw new RuntimeException("Exercise ID is required for deletion");
        }

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with ID: " + id));

        Category category = exercise.getCategory();
        if (category != null) {
            category.getExercises().remove(exercise);
        }

        exerciseRepository.delete(exercise);
    }
}