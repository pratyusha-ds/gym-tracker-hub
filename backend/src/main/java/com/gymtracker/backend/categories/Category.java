package com.gymtracker.backend.categories;

import com.gymtracker.backend.exercises.Exercise;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE) 
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String iconUrl;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default 
    private List<Exercise> exercises = new ArrayList<>();
}