package com.gymtracker.backend.categories;

import java.util.List;

public record CategoryDTO(
        Long id,
        String name,
        String iconUrl,
        List<ExerciseDTO> exercises) {
    public record ExerciseDTO(Long id, String name) {
    }
}