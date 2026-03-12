package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
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
        @Autowired
        private UserRepository userRepository;

        private User testUser;
        private Category testCategory;

        @BeforeEach
        void setUp() {
                testUser = userRepository.save(User.builder()
                                .clerkId("user_123").email("test@gym.com").name("Tester").build());

                testCategory = categoryRepository.save(Category.builder()
                                .name("Legs").user(testUser).build());
        }

        @Test
        void shouldFindExercisesByCategoryIdAndUserClerkId() {
                exerciseRepository.save(Exercise.builder()
                                .name("Lunges").category(testCategory).build());

                List<Exercise> results = exerciseRepository.findByCategoryIdAndCategoryUserClerkId(
                                testCategory.getId(), "user_123");

                assertEquals(1, results.size());
                assertEquals("Lunges", results.get(0).getName());
        }

        @Test
        void shouldNotFindExercisesForWrongUser() {
                exerciseRepository.save(Exercise.builder()
                                .name("Lunges").category(testCategory).build());

                List<Exercise> results = exerciseRepository.findByCategoryIdAndCategoryUserClerkId(
                                testCategory.getId(), "wrong_user_id");

                assertTrue(results.isEmpty());
        }

        @Test
        void shouldEnforceUniqueNamePerCategory() {
                exerciseRepository.saveAndFlush(Exercise.builder()
                                .name("Pushups").category(testCategory).build());

                Exercise duplicate = Exercise.builder()
                                .name("Pushups").category(testCategory).build();

                assertThrows(DataIntegrityViolationException.class, () -> {
                        exerciseRepository.saveAndFlush(duplicate);
                });
        }
}