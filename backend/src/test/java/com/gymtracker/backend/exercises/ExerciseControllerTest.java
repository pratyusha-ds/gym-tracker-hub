package com.gymtracker.backend.exercises;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExerciseController.class)
@ActiveProfiles("test")
public class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ExerciseService exerciseService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void shouldReturnOkWhenSearchingExercises() throws Exception {
        ExerciseDTO dto = new ExerciseDTO(1L, "Bench Press", 10L);

        when(exerciseService.searchExercises("Bench")).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/exercises/search").param("name", "Bench"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Bench Press"));
    }

    @Test
    @WithMockUser
    void shouldReturnOkWhenCreatingExercise() throws Exception {
        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Squat", 10L);

        ExerciseDTO savedDto = new ExerciseDTO(2L, "Squat", 10L);

        when(exerciseService.addExercise(any())).thenReturn(savedDto);

        mockMvc.perform(post("/api/exercises")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Squat"));
    }

    @Test
    @WithMockUser
    void shouldReturnOkWhenDeletingExercise() throws Exception {

        mockMvc.perform(delete("/api/exercises/1").with(csrf()))
                .andExpect(status().isNoContent());
    }
}