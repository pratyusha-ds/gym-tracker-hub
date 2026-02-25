package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExerciseServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ExerciseService exerciseService;

    @Test
    void shouldThrowExceptionWhenAddingExerciseToNonExistentCategory() {
        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Dips", 99L);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            exerciseService.addExercise(request);
        });

        assertEquals("Category not found", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenExerciseNameAlreadyExistsInCategory() {
        Category cat = new Category();
        ReflectionTestUtils.setField(cat, "id", 1L);
        cat.setName("Arms");

        Exercise existing = new Exercise();
        existing.setName("Bicep Curls");

        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Bicep Curls", 1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));
        when(exerciseRepository.findByCategoryId(1L)).thenReturn(List.of(existing));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            exerciseService.addExercise(request);
        });

        assertTrue(exception.getMessage().contains("already exists"));
    }

    @Test
    void shouldSuccessfullyDeleteExercise() {
        Exercise ex = new Exercise();
        ReflectionTestUtils.setField(ex, "id", 1L);

        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(ex));

        exerciseService.deleteExercise(1L);

        verify(exerciseRepository, times(1)).delete(ex);
    }
}