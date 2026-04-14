package com.revature.edzybackend.controller;

import com.revature.edzybackend.model.Courses;
import com.revature.edzybackend.repository.UserRepository;
import com.revature.edzybackend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
//@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    private CourseService courseService;

    @Autowired
    public void setCourseService(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    public List<Courses> findAll(){
        return courseService.getAllCourses();
    }

    @GetMapping("/courses/{id}")
    public Courses findById(@PathVariable String id){
        return courseService.getCourseById(id);
    }

    // Instructor - get all courses
    @GetMapping("/courses/my-courses")
    public List<Courses> findMyCourses(){
        return courseService.getAllInstructorCourses();
    }

    // Only instructor can create courses
    @PostMapping("/courses")
    public Courses createCourse(@RequestBody Courses course){
        return courseService.createCourse(course);
    }

    @PutMapping("/courses/{id}")
    public Courses updateCourse(@PathVariable String id, @RequestBody Courses updated){
        return courseService.updateCourse(id, updated);
    }

    @DeleteMapping("/courses/{id}")
    public String deleteCourse(@PathVariable String id){
        courseService.deleteById(id);
        return "Course Deleted Successfully";
    }
}
