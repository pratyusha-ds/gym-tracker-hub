package com.gymtracker.backend.exercises;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping("/search")
    public List<ExerciseDTO> search(@RequestParam String name) {
        return exerciseService.searchExercises(name);
    }

    @GetMapping("/category/{categoryId}")
    public List<ExerciseDTO> getByCategory(@PathVariable Long categoryId) {
        return exerciseService.getExercisesByCategory(categoryId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.mapToDTO(exerciseService.getExerciseById(id)));
    }

    @PostMapping
    public ExerciseDTO createExercise(@RequestBody ExerciseRequest request) {
        return exerciseService.addExercise(request);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExerciseDTO> updateExercise(
            @PathVariable Long id,
            @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    public record ExerciseRequest(String name, Long categoryId) {
    }
}