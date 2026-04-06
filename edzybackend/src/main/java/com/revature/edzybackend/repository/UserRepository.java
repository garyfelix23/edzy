package com.revature.edzybackend.repository;

import com.revature.edzybackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User,String> {
    // finds user by email ID, and we're adding it as Optional because, the email might or might not exist, so to handle NullPointerException, we added it.
    Optional<User> findByEmail(String email);
    // used to check if email ID is already registered or not
    boolean existsByEmail(String email);
}
