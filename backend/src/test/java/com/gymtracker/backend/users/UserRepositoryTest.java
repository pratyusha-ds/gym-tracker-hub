package com.gymtracker.backend.users;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindUserByClerkId() {
        // Arrange
        User user = User.builder()
                .clerkId("clerk_unique_123")
                .email("test@gymtracker.com")
                .name("Gym Member")
                .build();
        userRepository.save(user);

        // Act
        Optional<User> found = userRepository.findByClerkId("clerk_unique_123");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("test@gymtracker.com", found.get().getEmail());
    }

    @Test
    void shouldReturnEmptyWhenClerkIdDoesNotExist() {
        // Act
        Optional<User> found = userRepository.findByClerkId("non_existent_id");

        // Assert
        assertFalse(found.isPresent());
    }
}