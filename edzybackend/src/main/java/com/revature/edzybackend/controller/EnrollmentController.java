package com.revature.edzybackend.controller;

import com.revature.edzybackend.dto.DashboardResponse;
import com.revature.edzybackend.model.Courses;
import com.revature.edzybackend.model.Enrollment;
import com.revature.edzybackend.repository.CourseRepository;
import com.revature.edzybackend.repository.EnrollmentRepository;
import com.revature.edzybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {
    private EnrollmentRepository enrollmentRepository;
    private UserRepository userRepository;
    private CourseRepository courseRepository;

    @Autowired
    public void setEnrollmentRepository(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setCourseRepository(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Get Logged-in user
    private String getUserId(){
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        System.out.println("Email from token: " + email);

        return userRepository.findByEmail(email)
                .orElseThrow()
                .getId();
    }


    @PostMapping
    public Enrollment enroll(@RequestParam String courseId){
        String userId = getUserId();

        return enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    Enrollment e =  new Enrollment();
                    e.setUserId(userId);
                    e.setCourseId(courseId);
                    return enrollmentRepository.save(e);
                });
    }

    @GetMapping("/me")
    public List<Enrollment> getEnrollments(){
        return enrollmentRepository.findByUserId(getUserId());
    }

    @GetMapping("/dashboard")
    public List<DashboardResponse> getDashboard(){
        String userId = getUserId();

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);

        return enrollments.stream().map(e -> {
            Courses course = courseRepository.findById(e.getCourseId()).orElseThrow();

            DashboardResponse dto = new DashboardResponse();
            dto.setCourseId(course.getId());
            dto.setTitle(course.getTitle());
            dto.setProgress(e.getProgressPercentage());
            dto.setCompleted(e.isCompleted());

            return dto;
        }).toList();
    }

    @PutMapping("/{id}/progress")
    public Enrollment updateProgress(@PathVariable String id, @RequestParam int percent){
        Enrollment e = enrollmentRepository.findById(id).orElseThrow();

        String userId = getUserId();

        if(!e.getUserId().equals(userId)){
            throw new RuntimeException("Unauthorized");
        }

        // clamp between 0 and 100
        int clamped = Math.max(0, Math.min(100, percent));

        // only update if new value is GREATER than current value
        if (clamped > e.getProgressPercentage()) {
            e.setProgressPercentage(clamped);
            e.setCompleted(clamped == 100);
            enrollmentRepository.save(e);
        }

        // if new value is less or equal, just return current enrollment unchanged
        return e;
    }

}
