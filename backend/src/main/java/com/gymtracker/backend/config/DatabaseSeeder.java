package com.gymtracker.backend.config;

import com.gymtracker.backend.users.UserRepository;
import com.gymtracker.backend.users.UserService;
import com.gymtracker.backend.users.UserDTO;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;

    public DatabaseSeeder(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            System.out.println("SEEDING DEV ENVIRONMENT...");

            UserDTO devDto = new UserDTO("dev@example.com", "Dev User");
            userService.syncUser("dev_user_123", devDto);

            System.out.println("Dev User created with personal starter categories.");
        }
    }
}