package com.revature.edzybackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
@Data
public class User {
    @Id // mongodb automatically generates id whenever we create a document
    private String id;

    private String name;
    @Indexed(unique = true)  // this creates a unique index for email field, doesn't allow two users to register with same email id. (if they try, MONGODB will throw an error)
    private String email;
    private String password;
    private String role;
//    private String role = "USER";
}
