package com.revature.edzybackend.repository;

import com.revature.edzybackend.model.Courses;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<Courses, String> {
    List<Courses> findByInstructorId(String instructorId);
}

