package com.gymtracker.backend.sessions;

import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class WorkoutSessionRepositoryTest {

    @Autowired
    private WorkoutSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindSessionsByUserClerkId() {
        // Arrange
        User user = userRepository.save(User.builder()
                .clerkId("clerk_999")
                .email("fit@test.com")
                .name("Tester")
                .build());

        sessionRepository.save(WorkoutSession.builder()
                .user(user)
                .date(LocalDate.now())
                .build());

        // Act
        List<WorkoutSession> results = sessionRepository.findByUserClerkIdOrderByDateDesc("clerk_999");

        // Assert
        assertEquals(1, results.size());
        assertEquals("clerk_999", results.get(0).getUser().getClerkId());
    }

    @Test
    void shouldFindSessionByClerkIdAndDate() {
        // Arrange
        User user = userRepository.save(User.builder()
                .clerkId("clerk_1")
                .email("a@b.com")
                .build());

        LocalDate today = LocalDate.now();
        sessionRepository.save(WorkoutSession.builder()
                .user(user)
                .date(today)
                .build());

        // Act
        Optional<WorkoutSession> result = sessionRepository.findByUserClerkIdAndDate("clerk_1", today);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(today, result.get().getDate());
    }
}