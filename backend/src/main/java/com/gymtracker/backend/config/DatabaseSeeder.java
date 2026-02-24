package com.gymtracker.backend.config;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import com.gymtracker.backend.exercises.Exercise;
import com.gymtracker.backend.exercises.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ExerciseRepository exerciseRepository;

    public DatabaseSeeder(CategoryRepository categoryRepository, ExerciseRepository exerciseRepository) {
        this.categoryRepository = categoryRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {

            Category chest = createCategory("Chest", "fitness_center");
            Category back = createCategory("Back", "format_align_justify");
            Category legs = createCategory("Legs", "directions_run");
            Category shoulders = createCategory("Shoulders", "accessibility");
            Category arms = createCategory("Arms", "horizontal_rule");
            Category core = createCategory("Core", "adjust");
            Category cardio = createCategory("Cardio", "speed");

            categoryRepository.saveAll(List.of(chest, back, legs, shoulders, arms, core, cardio));

            List<Exercise> exercises = new ArrayList<>();

            exercises.add(createExercise("Flat Bench Press", chest));
            exercises.add(createExercise("Incline Dumbbell Press", chest));
            exercises.add(createExercise("Cable Flys", chest));

            exercises.add(createExercise("Deadlift", back));
            exercises.add(createExercise("Pull Ups", back));
            exercises.add(createExercise("Bent Over Rows", back));

            exercises.add(createExercise("Barbell Squat", legs));
            exercises.add(createExercise("Leg Press", legs));
            exercises.add(createExercise("Lunges", legs));

            exercises.add(createExercise("Overhead Press", shoulders));
            exercises.add(createExercise("Lateral Raises", shoulders));

            exercises.add(createExercise("Bicep Curls", arms));
            exercises.add(createExercise("Tricep Pushdowns", arms));

            exercises.add(createExercise("Plank", core));
            exercises.add(createExercise("Crunches", core));

            exercises.add(createExercise("Treadmill Running", cardio));
            exercises.add(createExercise("Stairmaster", cardio));
            exercises.add(createExercise("Elliptical", cardio));
            exercises.add(createExercise("Stationary Bike", cardio));

            exerciseRepository.saveAll(exercises);

            System.out.println("DATABASE SEEDED SUCCESSFULLY.");
            System.out.println("Created 7 Categories and " + exercises.size() + " Exercises.");
        }
    }

    private Category createCategory(String name, String icon) {
        Category c = new Category();
        c.setName(name);
        c.setIconUrl(icon);
        return c;
    }

    private Exercise createExercise(String name, Category category) {
        Exercise e = new Exercise();
        e.setName(name);
        e.setCategory(category);
        category.getExercises().add(e);
        return e;
    }
}