package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ExerciseRepositoryTest {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldFindExercisesByCategoryId() {
        Category cat = new Category();
        cat.setName("Legs");
        cat = categoryRepository.save(cat);

        Exercise ex = new Exercise();
        ex.setName("Lunges");
        ex.setCategory(cat);
        exerciseRepository.save(ex);

        List<Exercise> results = exerciseRepository.findByCategoryId(cat.getId());

        assertEquals(1, results.size());
        assertEquals("Lunges", results.get(0).getName());
    }

    @Test
    void shouldEnforceUniqueNamePerCategoryConstraint() {
        Category cat = new Category();
        cat.setName("Chest");
        cat = categoryRepository.save(cat);

        Exercise ex1 = new Exercise();
        ex1.setName("Pushups");
        ex1.setCategory(cat);
        exerciseRepository.saveAndFlush(ex1);

        Exercise ex2 = new Exercise();
        ex2.setName("Pushups");
        ex2.setCategory(cat);

        assertThrows(DataIntegrityViolationException.class, () -> {
            exerciseRepository.saveAndFlush(ex2);
        });
    }
}