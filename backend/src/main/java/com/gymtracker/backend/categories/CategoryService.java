package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

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
        Optional<Category> existingCategoryOpt = categoryRepository.findByNameIgnoreCase(cleanCatName);

        boolean noExercisesProvided = category.getExercises() == null || category.getExercises().isEmpty();

        Category finalCategory;
        if (existingCategoryOpt.isPresent()) {
            if (noExercisesProvided) {
                throw new RuntimeException("Category '" + cleanCatName + "' already exists.");
            }
            finalCategory = existingCategoryOpt.get();
        } else {
            finalCategory = new Category();
            finalCategory.setName(cleanCatName);
            finalCategory.setExercises(new ArrayList<>());
            finalCategory = categoryRepository.saveAndFlush(finalCategory);
        }

        if (!noExercisesProvided) {
            for (Exercise incomingEx : category.getExercises()) {
                String cleanExName = incomingEx.getName().trim();
                if (cleanExName.isEmpty())
                    continue;

                boolean alreadyHasExercise = finalCategory.getExercises().stream()
                        .anyMatch(e -> e.getName().equalsIgnoreCase(cleanExName));

                if (alreadyHasExercise) {
                    throw new RuntimeException("'" + cleanExName + "' already exists in " + finalCategory.getName());
                }

                Exercise newExercise = new Exercise();
                newExercise.setName(cleanExName);
                newExercise.setCategory(finalCategory);
                finalCategory.getExercises().add(newExercise);
            }
            return categoryRepository.save(finalCategory);
        }

        return finalCategory;
    }

    @Transactional
    public Category updateCategory(Long id, Category details) {
        if (id == null)
            throw new RuntimeException("ID is required for update");

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
        if (id == null)
            throw new RuntimeException("ID is required for deletion");

        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}