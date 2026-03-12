package com.gymtracker.backend.workoutsets;

import com.gymtracker.backend.exercises.Exercise;
import com.gymtracker.backend.exercises.ExerciseRepository;
import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import com.gymtracker.backend.sessions.WorkoutSession;
import com.gymtracker.backend.sessions.WorkoutSessionRepository;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class WorkoutSetRepositoryTest {

        @Autowired
        private WorkoutSetRepository workoutSetRepository;
        @Autowired
        private WorkoutSessionRepository sessionRepository;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private ExerciseRepository exerciseRepository;
        @Autowired
        private CategoryRepository categoryRepository;

        private User testUser;
        private Exercise testExercise;

        @BeforeEach
        void setUp() {
                testUser = userRepository.save(User.builder()
                                .clerkId("user_789").email("lift@gym.com").name("Pro Lifter").build());

                Category cat = categoryRepository.save(Category.builder()
                                .name("Legs").user(testUser).build());

                testExercise = exerciseRepository.save(Exercise.builder()
                                .name("Squat").category(cat).build());
        }

        @Test
        void shouldFindHistoryByExerciseAndUser() {
                // Arrange
                WorkoutSession session = sessionRepository.save(WorkoutSession.builder()
                                .user(testUser)
                                .date(LocalDate.now())
                                .build());

                workoutSetRepository.save(WorkoutSet.builder()
                                .weight(100.0).reps(10).exercise(testExercise).session(session).build());

                // Act
                List<WorkoutSet> history = workoutSetRepository
                                .findByExerciseIdAndSessionUserClerkIdOrderBySessionDateDesc(testExercise.getId(),
                                                "user_789");

                // Assert
                assertFalse(history.isEmpty());
                assertEquals(100.0, history.get(0).getWeight());
        }
}