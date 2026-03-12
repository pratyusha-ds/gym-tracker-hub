package com.gymtracker.backend.workoutsets;

import com.gymtracker.backend.exercises.Exercise;
import com.gymtracker.backend.exercises.ExerciseRepository;
import com.gymtracker.backend.sessions.WorkoutSession;
import com.gymtracker.backend.sessions.WorkoutSessionRepository;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WorkoutSetServiceTest {

    @Mock
    private WorkoutSetRepository workoutSetRepository;
    @Mock
    private WorkoutSessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ExerciseRepository exerciseRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkoutSetService workoutSetService;

    private void mockAuth() {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("user_123");
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void shouldLinkSetToExistingSession() {
        // Arrange
        mockAuth();
        User user = User.builder().clerkId("user_123").build();
        Exercise exercise = Exercise.builder().id(1L).name("Squat").build();
        WorkoutSession existingSession = WorkoutSession.builder().id(10L).user(user).date(LocalDate.now()).build();

        WorkoutSetDTO incomingDto = new WorkoutSetDTO(null, 50.0, 10, "Squat", 1L, LocalDate.now().toString());

        when(userRepository.findByClerkId("user_123")).thenReturn(Optional.of(user));
        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(exercise));
        when(sessionRepository.findByUserClerkIdAndDate(eq("user_123"), any(LocalDate.class)))
                .thenReturn(Optional.of(existingSession));
        when(workoutSetRepository.save(any(WorkoutSet.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        WorkoutSetDTO result = workoutSetService.saveSingleSetFromDTO(incomingDto);

        // Assert
        assertNotNull(result);
        verify(sessionRepository, never()).save(any(WorkoutSession.class));
        verify(workoutSetRepository, times(1)).save(any(WorkoutSet.class));
    }
}