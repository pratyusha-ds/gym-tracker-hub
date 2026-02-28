package com.gymtracker.backend.users;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/sync")
    public User syncUser(@RequestBody User user) {
        return userService.syncUser(user);
    }
}