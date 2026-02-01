package com.gymtracker.backend.exercises;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/search")
    public List<Exercise> search(@RequestParam String name) {
        return exerciseService.searchExercises(name);
    }

    @GetMapping("/category/{categoryId}")
    public List<Exercise> getByCategory(@PathVariable Long categoryId) {
        return exerciseService.getExercisesByCategory(categoryId);
    }
}