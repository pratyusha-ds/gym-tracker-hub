package com.gymtracker.backend.workoutsets;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workout-sets")
@RequiredArgsConstructor
public class WorkoutSetController {

    private final WorkoutSetService workoutSetService;

    @PostMapping
    public WorkoutSetDTO saveSet(@RequestBody WorkoutSetDTO dto) {
        return workoutSetService.saveSingleSetFromDTO(dto);
    }

    @GetMapping("/date/{date}")
    public List<WorkoutSetDTO> getSetsByDate(@PathVariable String date) {
        return workoutSetService.getSetsBySessionDate(date);
    }

    @PutMapping("/{id}")
    public WorkoutSetDTO updateSet(@PathVariable Long id, @RequestBody WorkoutSetDTO updateDto) {
        return workoutSetService.updateSet(id, updateDto);
    }

    @DeleteMapping("/{id}")
    public void deleteSet(@PathVariable Long id) {
        workoutSetService.deleteSet(id);
    }
}