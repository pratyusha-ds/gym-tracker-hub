package com.gymtracker.backend.sessions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WorkoutSessionController.class)
@ActiveProfiles("test")
public class WorkoutSessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WorkoutSessionService sessionService;

    @Test
    void shouldReturnOkForHistoryRequest() throws Exception {
        // Arrange
        WorkoutSessionDTO mockDto = new WorkoutSessionDTO(1L, LocalDate.now(), new ArrayList<>());
        when(sessionService.getMySessions()).thenReturn(List.of(mockDto));

        // Act & Assert
        mockMvc.perform(get("/api/sessions")
                .with(jwt().jwt(j -> j.subject("user_123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].sets").isArray());
    }

    @Test
    void shouldReturnOkWhenStartingSession() throws Exception {
        // Arrange
        WorkoutSessionDTO mockDto = new WorkoutSessionDTO(1L, LocalDate.now(), new ArrayList<>());
        when(sessionService.createSession()).thenReturn(mockDto);

        // Act & Assert
        mockMvc.perform(post("/api/sessions")
                .with(csrf())
                .with(jwt().jwt(j -> j.subject("user_123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturnNoContentWhenDeleting() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/sessions/1")
                .with(csrf())
                .with(jwt().jwt(j -> j.subject("user_123"))))
                .andExpect(status().isNoContent());
    }
}