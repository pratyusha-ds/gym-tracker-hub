package com.gymtracker.backend.users;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/sync")
    public User syncUser(@RequestBody UserDTO userDto, @AuthenticationPrincipal Jwt jwt) {
        return userService.syncUser(jwt.getSubject(), userDto);
    }
}