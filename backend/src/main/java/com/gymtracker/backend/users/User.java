package com.gymtracker.backend.users;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(unique = true, nullable = false)
    private String clerkId;

    @Column(nullable = false)
    private String email;

    private String name;
}