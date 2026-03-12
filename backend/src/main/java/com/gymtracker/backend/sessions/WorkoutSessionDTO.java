package com.gymtracker.backend.sessions;

import com.gymtracker.backend.workoutsets.WorkoutSetDTO;
import java.time.LocalDate;
import java.util.List;

public record WorkoutSessionDTO(
                Long id,
                LocalDate date,
                List<WorkoutSetDTO> sets) {
}