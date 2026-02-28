package com.gymtracker.backend.workoutsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workout-sets")
public class WorkoutSetController {

    @Autowired
    private WorkoutSetService workoutSetService;

    @PostMapping("/batch")
    public List<WorkoutSet> finishWorkout(@RequestBody List<WorkoutSet> sets) {
        return workoutSetService.saveAllSets(sets);
    }

    @GetMapping("/exercise/{exerciseId}")
    public List<WorkoutSet> getExerciseHistory(@PathVariable Long exerciseId) {
        return workoutSetService.getHistoryByExercise(exerciseId);
    }
}