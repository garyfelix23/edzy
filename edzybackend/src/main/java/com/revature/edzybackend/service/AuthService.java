package com.revature.edzybackend.service;

import com.revature.edzybackend.dto.AuthResponse;
import com.revature.edzybackend.dto.LoginRequest;
import com.revature.edzybackend.dto.RegisterRequest;
import com.revature.edzybackend.model.User;
import com.revature.edzybackend.repository.UserRepository;
import com.revature.edzybackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req){
        // checks if user email already exists or not
        if(userRepository.existsByEmail(req.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        // creating user object and setting the values
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        // the password is encrypted before saved to mongodb
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        // saves the data to mongodb
        user.setRole("USER");
        userRepository.save(user);

        // encrypting the email inside token and generating the token
        String token = jwtUtil.generateToken(user.getEmail());
        // returning the response to the frontend, so that, it can be used later.
//        return new AuthResponse(token, user.getId(), user.getName(), user.getPassword());
        return new AuthResponse(token, user.getId(), user.getName(), user.getRole());
    }

    public AuthResponse login(LoginRequest req){
        // finds the user by email id, if not, throws an error
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        // hashes the entered password and compares it with the stored hash, if no match, throw the error.
        if(!passwordEncoder.matches(req.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        // returns the token to the frontend
        String token = jwtUtil.generateToken(user.getEmail());
//        return new AuthResponse(token, user.getId(), user.getName(), user.getPassword());
        return new AuthResponse(token, user.getId(), user.getName(), user.getRole());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
