package com.revature.edzybackend.service;

import com.revature.edzybackend.model.Courses;
import com.revature.edzybackend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private CourseRepository courseRepo;

    @Autowired
    public void setCourseRepo(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    public List<Courses> getAllCourses(){
        return courseRepo.findAll();
    }

    public Courses createCourse(Courses course){
        return courseRepo.save(course);
    }

    public Courses getCourseById(String id) {
        return courseRepo.findById(id).orElseThrow();
    }
}
