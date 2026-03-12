package com.gymtracker.backend.categories;

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

@WebMvcTest(CategoryController.class)
@ActiveProfiles("test")
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private CategoryService categoryService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void shouldReturnDTOWhenCreatingCategory() throws Exception {
        // Arrange
        CategoryDTO.ExerciseDTO exDto = new CategoryDTO.ExerciseDTO(10L, "Bench Press");
        CategoryDTO responseDto = new CategoryDTO(1L, "Strength", "icon_url", List.of(exDto));

        Category inputEntity = Category.builder().name("Strength").build();

        when(categoryService.saveCategory(any())).thenReturn(responseDto);

        // Act & Assert
        mockMvc.perform(post("/api/categories")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputEntity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Strength"))
                .andExpect(jsonPath("$.exercises[0].name").value("Bench Press"));
    }

    @Test
    @WithMockUser
    void shouldReturnNoContentWhenDeletingCategory() throws Exception {
        mockMvc.perform(delete("/api/categories/1")
                .with(csrf()))
                .andExpect(status().isNoContent());
    }
}