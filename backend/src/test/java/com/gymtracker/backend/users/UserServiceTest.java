package com.gymtracker.backend.users;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

        @Mock
        private UserRepository userRepository;

        @Mock
        private CategoryRepository categoryRepository;

        @InjectMocks
        private UserService userService;

        @Test
        void shouldCreateNewUserWhenNotFoundAndSeedStarterKit() {
                // Arrange
                UserDTO incomingDto = new UserDTO("new@gym.com", "New User");
                String clerkId = "new_id";

                when(userRepository.findByClerkId(clerkId)).thenReturn(Optional.empty());
                when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

                when(categoryRepository.findByUserClerkId(clerkId)).thenReturn(Collections.emptyList());

                // Act
                User result = userService.syncUser(clerkId, incomingDto);

                // Assert
                assertEquals(clerkId, result.getClerkId());
                assertEquals("new@gym.com", result.getEmail());
                verify(userRepository, times(1)).save(any(User.class));

                verify(categoryRepository, times(1)).saveAll(any());
        }

        @Test
        void shouldUpdateExistingUserAndNotSeedIfCategoriesExist() {
                // Arrange
                User existingUser = User.builder().clerkId("old_id").email("old@gym.com").build();
                UserDTO updateDto = new UserDTO("new@gym.com", "Updated Name");
                String clerkId = "old_id";

                when(userRepository.findByClerkId(clerkId)).thenReturn(Optional.of(existingUser));
                when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

                when(categoryRepository.findByUserClerkId(clerkId)).thenReturn(List.of(new Category()));

                // Act
                User result = userService.syncUser(clerkId, updateDto);

                // Assert
                assertEquals("new@gym.com", result.getEmail());
                assertEquals("Updated Name", result.getName());

                verify(categoryRepository, never()).saveAll(any());
        }
}