package com.revature.edzybackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "enrollments")
@Data
public class Enrollment {
    @Id
    private String id;

    private String userId;
    private String courseId;

    // list for completed modules and based on this the progress is calculated
    private List<String> completedModules = new ArrayList<>();

    private int progressPercentage = 0; // initial progress is set to 0% by default
    private boolean completed = false;  // this changes automatically when user completes the course
}

// This enrollment model is created because one user can enroll in many courses and
// one course can have many users. So this acts as a bridge between users and courses.
