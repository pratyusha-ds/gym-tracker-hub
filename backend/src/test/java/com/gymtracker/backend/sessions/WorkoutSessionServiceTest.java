package com.gymtracker.backend.sessions;

import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import org.junit.jupiter.api.BeforeEach;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WorkoutSessionServiceTest {

    @Mock
    private WorkoutSessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkoutSessionService sessionService;

    @BeforeEach
    void mockAuth() {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("fake_user_123");
        when(authentication.getPrincipal()).thenReturn(jwt);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void shouldCreateSessionForAuthenticatedUser() {
        // Arrange
        User user = User.builder().clerkId("fake_user_123").build();
        WorkoutSession sessionEntity = WorkoutSession.builder()
                .id(1L)
                .user(user)
                .date(LocalDate.now())
                .build();

        when(userRepository.findByClerkId("fake_user_123")).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(WorkoutSession.class))).thenReturn(sessionEntity);

        // Act
        WorkoutSessionDTO resultDto = sessionService.createSession();

        // Assert
        assertNotNull(resultDto);
        assertEquals(1L, resultDto.id());
        assertEquals(LocalDate.now(), resultDto.date());
        verify(sessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void shouldDeleteSessionWhenOwner() {
        // Arrange
        User user = User.builder().clerkId("fake_user_123").build();
        WorkoutSession session = WorkoutSession.builder().id(1L).user(user).build();

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // Act
        sessionService.deleteSession(1L);

        // Assert
        verify(sessionRepository, times(1)).delete(session);
    }
}