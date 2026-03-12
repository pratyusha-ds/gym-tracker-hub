package com.gymtracker.backend.workoutsets;

import com.gymtracker.backend.exercises.ExerciseRepository;
import com.gymtracker.backend.sessions.WorkoutSession;
import com.gymtracker.backend.sessions.WorkoutSessionRepository;
import com.gymtracker.backend.users.User;
import com.gymtracker.backend.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutSetService {

        private final WorkoutSetRepository workoutSetRepository;
        private final WorkoutSessionRepository sessionRepository;
        private final UserRepository userRepository;
        private final ExerciseRepository exerciseRepository;

        private String getClerkUserId() {
                var auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
                        return jwt.getSubject();
                }
                throw new RuntimeException("Unauthorized: No valid authentication token found.");
        }

        @Transactional
        public WorkoutSetDTO saveSingleSetFromDTO(WorkoutSetDTO dto) {
                String clerkId = getClerkUserId();
                User user = userRepository.findByClerkId(clerkId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                LocalDate targetDate = (dto.date() != null && !dto.date().isBlank())
                                ? LocalDate.parse(dto.date())
                                : LocalDate.now();

                WorkoutSession session = sessionRepository
                                .findByUserClerkIdAndDate(clerkId, targetDate)
                                .orElseGet(() -> sessionRepository.save(
                                                WorkoutSession.builder()
                                                                .user(user)
                                                                .date(targetDate)
                                                                .build()));

                WorkoutSet set = WorkoutSet.builder()
                                .weight(dto.weight())
                                .reps(dto.reps())
                                .exercise(exerciseRepository.findById(dto.exerciseId())
                                                .orElseThrow(() -> new RuntimeException("Exercise not found")))
                                .session(session)
                                .build();

                WorkoutSet saved = workoutSetRepository.save(set);
                return new WorkoutSetDTO(saved.getId(), saved.getWeight(), saved.getReps(),
                                saved.getExercise().getName(), saved.getExercise().getId(),
                                session.getDate().toString());
        }

        public List<WorkoutSetDTO> getSetsBySessionDate(String date) {
                return workoutSetRepository.findBySessionDateAndSessionUserClerkId(
                                LocalDate.parse(date), getClerkUserId())
                                .stream()
                                .map(set -> new WorkoutSetDTO(
                                                set.getId(),
                                                set.getWeight(),
                                                set.getReps(),
                                                set.getExercise().getName(),
                                                set.getExercise().getId(),
                                                set.getSession().getDate().toString()))
                                .collect(Collectors.toList());
        }

        @Transactional
        public WorkoutSetDTO updateSet(Long id, WorkoutSetDTO dto) {
                WorkoutSet set = workoutSetRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Set not found"));

                if (!set.getSession().getUser().getClerkId().equals(getClerkUserId())) {
                        throw new RuntimeException("Unauthorized");
                }

                set.setWeight(dto.weight());
                set.setReps(dto.reps());
                WorkoutSet updated = workoutSetRepository.save(set);

                return new WorkoutSetDTO(
                                updated.getId(),
                                updated.getWeight(),
                                updated.getReps(),
                                updated.getExercise().getName(),
                                updated.getExercise().getId(),
                                updated.getSession().getDate().toString());
        }

        @Transactional
        public void deleteSet(Long id) {
                WorkoutSet set = workoutSetRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Set not found"));

                if (!set.getSession().getUser().getClerkId().equals(getClerkUserId())) {
                        throw new RuntimeException("Unauthorized");
                }
                workoutSetRepository.delete(set);
        }

        public List<WorkoutSet> getHistoryByExercise(Long exerciseId) {
                return workoutSetRepository.findByExerciseIdAndSessionUserClerkIdOrderBySessionDateDesc(
                                exerciseId, getClerkUserId());
        }
}