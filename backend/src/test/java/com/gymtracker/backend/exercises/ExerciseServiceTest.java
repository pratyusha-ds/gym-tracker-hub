package com.gymtracker.backend.exercises;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import com.gymtracker.backend.users.User;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ExerciseServiceTest {

    @Mock
    private ExerciseRepository exerciseRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @Mock
    private Jwt jwt;

    @InjectMocks
    private ExerciseService exerciseService;

    @BeforeEach
    void setupSecurity() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(jwt.getSubject()).thenReturn("user_123");
    }

    @Test
    void shouldThrowExceptionWhenExerciseNameAlreadyExistsInCategory() {
        User user = User.builder().clerkId("user_123").build();
        Exercise existing = Exercise.builder().name("Bicep Curls").build();
        Category cat = Category.builder()
                .id(1L)
                .name("Arms")
                .user(user)
                .exercises(new ArrayList<>(List.of(existing)))
                .build();

        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Bicep Curls", 1L);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));

        assertThrows(RuntimeException.class, () -> exerciseService.addExercise(request));
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotOwnCategory() {
        User differentUser = User.builder().clerkId("stranger").build();
        Category cat = Category.builder().id(1L).user(differentUser).build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));
        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Illegal Move", 1L);

        assertThrows(RuntimeException.class, () -> exerciseService.addExercise(request));
    }

    @Test
    void shouldSuccessfullyDeleteExercise() {
        User owner = User.builder().clerkId("user_123").build();
        Category cat = Category.builder().id(10L).user(owner).build();
        Exercise ex = Exercise.builder().id(1L).category(cat).build();

        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(ex));

        exerciseService.deleteExercise(1L);

        verify(exerciseRepository, times(1)).delete(ex);
    }
}