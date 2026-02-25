package com.gymtracker.backend.categories;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldFindCategoryByNameIgnoreCase() {

        Category category = new Category();
        category.setName("Chest Day");
        categoryRepository.save(category);

        Optional<Category> found = categoryRepository.findByNameIgnoreCase("CHEST DAY");

        assertTrue(found.isPresent());
        assertEquals("Chest Day", found.get().getName());
    }

    @Test
    void shouldFindCategoriesContainingString() {

        Category cat1 = new Category();
        cat1.setName("Back and Biceps");
        Category cat2 = new Category();
        cat2.setName("Upper Body");
        categoryRepository.save(cat1);
        categoryRepository.save(cat2);

        List<Category> results = categoryRepository.findByNameContainingIgnoreCase("UPPER");

        assertEquals(1, results.size());
        assertEquals("Upper Body", results.get(0).getName());
    }

    @Test
    void shouldEnforceUniqueNameConstraint() {

        Category cat1 = new Category();
        cat1.setName("Legs");
        categoryRepository.saveAndFlush(cat1);

        Category cat2 = new Category();
        cat2.setName("Legs");

        assertThrows(DataIntegrityViolationException.class, () -> {
            categoryRepository.saveAndFlush(cat2);
        });
    }
}