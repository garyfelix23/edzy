package com.revature.edzybackend.repository;

import com.revature.edzybackend.model.Courses;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends MongoRepository<Courses, String> {

}

