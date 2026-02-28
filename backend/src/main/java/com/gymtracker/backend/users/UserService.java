package com.gymtracker.backend.users;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User syncUser(User user) {
        return userRepository.findByClerkId(user.getClerkId())
                .map(existingUser -> {
                    existingUser.setEmail(user.getEmail());
                    existingUser.setName(user.getName());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> userRepository.save(user));
    }
}