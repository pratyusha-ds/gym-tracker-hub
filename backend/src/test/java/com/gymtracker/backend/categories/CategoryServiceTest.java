package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @Mock
    private Jwt jwt;

    @InjectMocks
    private CategoryService categoryService;

    @BeforeEach
    void setupSecurity() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getSubject()).thenReturn("user_123");
    }

    @Test
    void shouldThrowExceptionWhenNameIsEmpty() {
        Category emptyCategory = Category.builder().name("").build();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            categoryService.saveCategory(emptyCategory);
        });
        assertEquals("Category name cannot be empty", exception.getMessage());
    }

    @Test
    void shouldReturnDTOWhenSavingCategory() {
        // Arrange
        Category incoming = Category.builder()
                .name("Back")
                .exercises(new ArrayList<>(List.of(Exercise.builder().name("Pullups").build())))
                .build();

        User mockUser = User.builder().clerkId("user_123").build();

        when(userRepository.findByClerkId("user_123")).thenReturn(Optional.of(mockUser));
        when(categoryRepository.findByNameIgnoreCaseAndUserClerkId("Back", "user_123"))
                .thenReturn(Optional.empty());

        when(categoryRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(categoryRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        CategoryDTO result = categoryService.saveCategory(incoming);

        // Assert
        assertNotNull(result);
        assertEquals("Back", result.name());
        assertEquals(1, result.exercises().size());
        assertEquals("Pullups", result.exercises().get(0).name());
    }

    @Test
    void shouldHandleUnauthorizedAccessOnUpdate() {
        Category existing = Category.builder()
                .id(1L)
                .name("Old Name")
                .user(User.builder().clerkId("DIFFERENT_USER").build())
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class, () -> {
            categoryService.updateCategory(1L, Category.builder().name("New Name").build());
        });
    }
}