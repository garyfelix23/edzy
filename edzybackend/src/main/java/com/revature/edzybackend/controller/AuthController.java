package com.revature.edzybackend.controller;

import com.revature.edzybackend.dto.AuthResponse;
import com.revature.edzybackend.dto.LoginRequest;
import com.revature.edzybackend.dto.RegisterRequest;
import com.revature.edzybackend.model.User;
import com.revature.edzybackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {
    private AuthService authService;

    @Autowired
    public void setAuthService(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return authService.getAllUsers();
    }

    @PostMapping("/auth/register")
    public AuthResponse register(@RequestBody RegisterRequest req){
        return authService.register(req);
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@RequestBody LoginRequest req){
        return authService.login(req);
    }

}
