package com.gymtracker.backend.categories;

import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {

        testUser = User.builder()
                .clerkId("user_123")
                .email("test@gym.com")
                .name("Test User")
                .build();
        userRepository.save(testUser);
    }

    @Test
    void shouldFindCategoryByNameIgnoreCaseAndUserClerkId() {
        // Arrange
        Category category = Category.builder()
                .name("Chest Day")
                .user(testUser)
                .build();
        categoryRepository.save(category);

        // Act
        Optional<Category> found = categoryRepository.findByNameIgnoreCaseAndUserClerkId("CHEST DAY", "user_123");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("Chest Day", found.get().getName());
    }

    @Test
    void shouldFindCategoriesContainingStringForSpecificUser() {
        // Arrange
        categoryRepository.save(Category.builder().name("Upper Body").user(testUser).build());
        categoryRepository.save(Category.builder().name("Lower Body").user(testUser).build());

        User otherUser = User.builder().clerkId("user_456").email("other@gym.com").name("Other").build();
        userRepository.save(otherUser);
        categoryRepository.save(Category.builder().name("Upper Strength").user(otherUser).build());

        // Act
        List<Category> results = categoryRepository.findByNameContainingIgnoreCaseAndUserClerkId("UPPER", "user_123");

        // Assert
        assertEquals(1, results.size(), "Should only find the category belonging to user_123");
        assertEquals("Upper Body", results.get(0).getName());
    }

    @Test
    void shouldFindAllCategoriesByUserClerkId() {
        // Arrange
        categoryRepository.save(Category.builder().name("Back").user(testUser).build());
        categoryRepository.save(Category.builder().name("Legs").user(testUser).build());

        // Act
        List<Category> results = categoryRepository.findByUserClerkId("user_123");

        // Assert
        assertEquals(2, results.size());
    }

    @Test
    void shouldEnforceUniqueNamePerUser() {
        // Arrange
        categoryRepository.saveAndFlush(Category.builder().name("Legs").user(testUser).build());

        // Act & Assert
        Category duplicate = Category.builder().name("Legs").user(testUser).build();

        assertThrows(DataIntegrityViolationException.class, () -> {
            categoryRepository.saveAndFlush(duplicate);
        });
    }
}