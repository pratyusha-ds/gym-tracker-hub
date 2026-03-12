package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private String getClerkUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        throw new RuntimeException("Unauthorized: No valid Clerk session found.");
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByUserClerkId(getClerkUserId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CategoryDTO> searchByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCaseAndUserClerkId(name, getClerkUserId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO saveCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new RuntimeException("Category name cannot be empty");
        }
        String clerkId = getClerkUserId();
        String cleanCatName = category.getName().trim();
        var existingCategoryOpt = categoryRepository.findByNameIgnoreCaseAndUserClerkId(cleanCatName, clerkId);

        if (category.getExercises() == null || category.getExercises().isEmpty()) {
            if (existingCategoryOpt.isPresent()) {
                throw new RuntimeException("Category '" + cleanCatName + "' already exists.");
            }
        }

        User user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not synced."));

        Category finalCategory = existingCategoryOpt.orElseGet(() -> categoryRepository.saveAndFlush(Category.builder()
                .name(cleanCatName)
                .user(user)
                .exercises(new ArrayList<>())
                .build()));

        if (category.getExercises() != null && !category.getExercises().isEmpty()) {
            for (Exercise incomingEx : category.getExercises()) {
                String cleanExName = incomingEx.getName().trim();
                if (cleanExName.isEmpty())
                    continue;

                boolean exerciseExists = finalCategory.getExercises().stream()
                        .anyMatch(e -> e.getName().equalsIgnoreCase(cleanExName));

                if (exerciseExists) {
                    throw new RuntimeException("Exercise '" + cleanExName + "' already exists in " + cleanCatName);
                }

                finalCategory.getExercises().add(Exercise.builder()
                        .name(cleanExName)
                        .category(finalCategory)
                        .build());
            }
            categoryRepository.save(finalCategory);
        }

        return mapToDTO(finalCategory);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, Category details) {
        String clerkId = getClerkUserId();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getClerkId().equals(clerkId)) {
            throw new RuntimeException("Unauthorized: Access denied.");
        }

        category.setName(details.getName().trim());
        return mapToDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        String clerkId = getClerkUserId();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getClerkId().equals(clerkId)) {
            throw new RuntimeException("Unauthorized.");
        }
        categoryRepository.delete(category);
    }

    private CategoryDTO mapToDTO(Category category) {
        List<CategoryDTO.ExerciseDTO> exerciseDTOs = category.getExercises().stream()
                .map(ex -> new CategoryDTO.ExerciseDTO(ex.getId(), ex.getName()))
                .collect(Collectors.toList());

        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getIconUrl(),
                exerciseDTOs);
    }
}