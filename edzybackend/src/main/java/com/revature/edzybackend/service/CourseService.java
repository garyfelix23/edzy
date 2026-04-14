package com.revature.edzybackend.service;

import com.revature.edzybackend.model.Courses;
import com.revature.edzybackend.repository.CourseRepository;
import com.revature.edzybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private CourseRepository courseRepo;
    private UserRepository userRepo;

    @Autowired
    public void setCourseRepo(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    @Autowired
    public void setUserRepo(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // To get logged-in user id
    private String getUserId(){
        // the SecurityContextHolder is a spring security class that holds the security context for the current thread
        String email = SecurityContextHolder
                .getContext()  //
                .getAuthentication()
                .getName();
        return userRepo.findByEmail(email).orElseThrow().getId();
    }

    public List<Courses> getAllCourses(){
        return courseRepo.findAll();
    }

    public Courses getCourseById(String id) {
        return courseRepo.findById(id).orElseThrow();
    }

    public List<Courses> getAllInstructorCourses(){
        String instructorId = getUserId();
        return courseRepo.findByInstructorId(instructorId);
    }

    // only instructor can create courses
    public Courses createCourse(Courses course){
        String instructorId = getUserId();
        course.setInstructorId(instructorId);
        return courseRepo.save(course);
    }

    public Courses updateCourse(String id, Courses updated){
        Courses existing = courseRepo.findById(id).orElseThrow();

        if(!existing.getInstructorId().equals(getUserId())){
            throw new RuntimeException("Unauthorized");
        }

        updated.setId(id);
        updated.setInstructorId(existing.getInstructorId());
        return courseRepo.save(updated);
    }

    public void deleteById(String id) {
        Courses existing = courseRepo.findById(id).orElseThrow();

        if(!existing.getInstructorId().equals(getUserId())){
            throw new RuntimeException("Unauthorized");
        }

        courseRepo.deleteById(id);
    }
}
