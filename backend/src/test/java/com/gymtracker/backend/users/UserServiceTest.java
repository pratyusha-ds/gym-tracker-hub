package com.gymtracker.backend.users;

import com.gymtracker.backend.categories.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        void shouldCreateNewUserWhenNotFound() {

                UserDTO incomingDto = new UserDTO("new@gym.com", "New User");

                when(userRepository.findByClerkId("new_id")).thenReturn(Optional.empty());

                when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

                User result = userService.syncUser("new_id", incomingDto);

                assertEquals("new_id", result.getClerkId());
                assertEquals("new@gym.com", result.getEmail());
                verify(userRepository, times(1)).save(any(User.class));
                verify(categoryRepository, times(1)).saveAll(any());
        }

        @Test
        void shouldUpdateExistingUser() {
                User existingUser = User.builder().clerkId("old_id").email("old@gym.com").build();
                UserDTO updateDto = new UserDTO("new@gym.com", "Updated Name");

                when(userRepository.findByClerkId("old_id")).thenReturn(Optional.of(existingUser));
                when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

                User result = userService.syncUser("old_id", updateDto);

                assertEquals("new@gym.com", result.getEmail());
                assertEquals("Updated Name", result.getName());
        }
}