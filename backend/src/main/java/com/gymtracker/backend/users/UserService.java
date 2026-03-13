package com.gymtracker.backend.users;

import com.gymtracker.backend.categories.Category;
import com.gymtracker.backend.categories.CategoryRepository;
import com.gymtracker.backend.exercises.Exercise;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

        private final UserRepository userRepository;
        private final CategoryRepository categoryRepository;

        @Transactional
        public User syncUser(String clerkId, UserDTO dto) {
                User user = userRepository.findByClerkId(clerkId)
                                .map(existingUser -> {
                                        existingUser.setEmail(dto.email());
                                        existingUser.setName(dto.name());
                                        return userRepository.save(existingUser);
                                })
                                .orElseGet(() -> {
                                        User newUser = new User();
                                        newUser.setClerkId(clerkId);
                                        newUser.setEmail(dto.email());
                                        newUser.setName(dto.name());
                                        return userRepository.save(newUser);
                                });

                if (categoryRepository.findByUserClerkId(clerkId).isEmpty()) {
                        seedStarterKit(user);
                }

                return user;
        }

        private void seedStarterKit(User user) {
                List<Category> categories = new ArrayList<>();

                categories.add(buildCategoryWithExercises("Chest", "fitness_center", user,
                                List.of("Flat Bench Press", "Incline Dumbbell Press", "Chest Flys",
                                                "Dips (Chest Focus)")));

                categories.add(buildCategoryWithExercises("Back", "reorder", user,
                                List.of("Deadlift", "Pull-ups", "Bent Over Rows", "Lat Pulldowns", "Single Arm Rows")));

                categories.add(buildCategoryWithExercises("Legs", "straighten", user,
                                List.of("Barbell Squat", "Leg Press", "Leg Extension", "Hamstring Curls",
                                                "Calf Raises")));

                categories.add(buildCategoryWithExercises("Shoulders", "architecture", user,
                                List.of("Overhead Press", "Lateral Raises", "Front Raises", "Face Pulls")));

                categories.add(buildCategoryWithExercises("Biceps", "add_task", user,
                                List.of("Barbell Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls")));

                categories.add(buildCategoryWithExercises("Triceps", "bolt", user,
                                List.of("Skull Crushers", "Tricep Pushdowns", "Overhead Extensions")));

                categories.add(buildCategoryWithExercises("Abs", "Apps", user,
                                List.of("Plank", "Hanging Leg Raises", "Russian Twists", "Crunches")));

                categories.add(buildCategoryWithExercises("Cardio", "directions_run", user,
                                List.of("Treadmill Running", "Stationary Bike", "Stairmaster", "Swimming")));

                categories.add(buildCategoryWithExercises("Stretching", "accessibility", user,
                                List.of("Yoga", "Dynamic Warm-up", "Foam Rolling", "Static Stretching")));

                categoryRepository.saveAll(categories);
        }

        private Category buildCategoryWithExercises(String name, String icon, User user, List<String> exerciseNames) {
                Category category = Category.builder()
                                .name(name)
                                .iconUrl(icon)
                                .user(user)
                                .exercises(new ArrayList<>())
                                .build();

                exerciseNames.forEach(exName -> {
                        category.getExercises().add(
                                        Exercise.builder()
                                                        .name(exName)
                                                        .category(category)
                                                        .build());
                });

                return category;
        }
}