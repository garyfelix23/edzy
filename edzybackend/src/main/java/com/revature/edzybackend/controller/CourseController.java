package com.revature.edzybackend.controller;

import com.revature.edzybackend.model.Courses;
import com.revature.edzybackend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
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

    @PostMapping("/courses")
    public Courses createCourse(@RequestBody Courses course){
        return courseService.createCourse(course);
    }
}
