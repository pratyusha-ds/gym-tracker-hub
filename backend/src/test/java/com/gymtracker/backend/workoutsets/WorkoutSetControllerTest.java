package com.gymtracker.backend.workoutsets;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WorkoutSetController.class)
@ActiveProfiles("test")
public class WorkoutSetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WorkoutSetService workoutSetService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnOkWhenSavingSingleSet() throws Exception {
        // Arrange
        WorkoutSetDTO inputDto = new WorkoutSetDTO(null, 60.0, 8, "Squat", 1L, "2026-03-12");
        WorkoutSetDTO savedDto = new WorkoutSetDTO(100L, 60.0, 8, "Squat", 1L, "2026-03-12");

        when(workoutSetService.saveSingleSetFromDTO(any(WorkoutSetDTO.class))).thenReturn(savedDto);

        // Act & Assert
        mockMvc.perform(post("/api/workout-sets")
                .with(csrf())
                .with(jwt().jwt(j -> j.subject("user_123")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.weight").value(60.0));
    }
}