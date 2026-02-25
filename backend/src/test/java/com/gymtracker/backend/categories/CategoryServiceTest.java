package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void shouldThrowExceptionWhenNameIsEmpty() {

        Category emptyCategory = new Category();
        emptyCategory.setName("");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            categoryService.saveCategory(emptyCategory);
        });
        assertEquals("Category name cannot be empty", exception.getMessage());
    }

    @Test
    void shouldHandleExerciseLoopCorrectly() {

        Category incoming = new Category();
        incoming.setName("Back");
        Exercise ex = new Exercise();
        ex.setName("Pullups");
        incoming.setExercises(List.of(ex));

        when(categoryRepository.findByNameIgnoreCase("Back")).thenReturn(Optional.empty());
        when(categoryRepository.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(categoryRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Category saved = categoryService.saveCategory(incoming);

        assertEquals(1, saved.getExercises().size());
        assertEquals("Pullups", saved.getExercises().get(0).getName());
    }
}