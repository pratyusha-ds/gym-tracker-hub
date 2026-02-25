package com.gymtracker.backend.exercises;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
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
        if (categoryId == null)
            return List.of();
        return exerciseService.getExercisesByCategory(categoryId);
    }

    @PostMapping
    public Exercise createExercise(@RequestBody ExerciseRequest request) {
        return exerciseService.addExercise(request);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody ExerciseRequest request) {
        if (id == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Exercise ID required"));
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        if (id == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Exercise ID required"));
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }

    public record ExerciseRequest(String name, Long categoryId) {
    }
}