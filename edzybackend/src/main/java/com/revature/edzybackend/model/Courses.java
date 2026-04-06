package com.revature.edzybackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Courses {
    @Id
    private String id;

    private String title;
    private String description;
    private String instructorName;
    private String imageLink;
    private String videoLink;
    private String level;
    private List<String> tags;
    private String duration;
    private String category;
}
