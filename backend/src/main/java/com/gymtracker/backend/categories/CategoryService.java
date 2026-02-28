package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> searchByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public Category saveCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new RuntimeException("Category name cannot be empty");
        }

        String cleanCatName = category.getName().trim();
        
        Category finalCategory = categoryRepository.findByNameIgnoreCase(cleanCatName)
                .orElseGet(() -> categoryRepository.saveAndFlush(
                    Category.builder()
                        .name(cleanCatName)
                        .exercises(new ArrayList<>())
                        .build()
                ));

        if (category.getExercises() != null && !category.getExercises().isEmpty()) {
            for (Exercise incomingEx : category.getExercises()) {
                String cleanExName = incomingEx.getName().trim();
                if (cleanExName.isEmpty()) continue;

                boolean exists = finalCategory.getExercises().stream()
                        .anyMatch(e -> e.getName().equalsIgnoreCase(cleanExName));

                if (exists) {
                    throw new RuntimeException("'" + cleanExName + "' already exists in " + finalCategory.getName());
                }

                finalCategory.getExercises().add(Exercise.builder()
                        .name(cleanExName)
                        .category(finalCategory)
                        .build());
            }
            return categoryRepository.save(finalCategory);
        }

        return finalCategory;
    }

    @Transactional
    public Category updateCategory(Long id, Category details) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.findByNameIgnoreCase(details.getName().trim())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Category '" + details.getName() + "' already exists.");
                    }
                });

        category.setName(details.getName().trim());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}