package com.gymtracker.backend.exercises;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
    void shouldReturnOkWhenSearchingExercises() throws Exception {
        Exercise ex = new Exercise();
        ex.setName("Bench Press");
        ReflectionTestUtils.setField(ex, "id", 1L);

        when(exerciseService.searchExercises("Bench")).thenReturn(List.of(ex));

        mockMvc.perform(get("/api/exercises/search").param("name", "Bench"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Bench Press"));
    }

    @Test
    void shouldReturnOkWhenCreatingExercise() throws Exception {
        ExerciseController.ExerciseRequest request = new ExerciseController.ExerciseRequest("Squat", 1L);
        Exercise savedExercise = new Exercise();
        savedExercise.setName("Squat");
        ReflectionTestUtils.setField(savedExercise, "id", 10L);

        when(exerciseService.addExercise(any())).thenReturn(savedExercise);

        mockMvc.perform(post("/api/exercises")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Squat"))
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void shouldReturnOkWhenDeletingExercise() throws Exception {
        mockMvc.perform(delete("/api/exercises/1"))
                .andExpect(status().isOk());
    }
}