package com.shophub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.shophub.model.User;
import com.shophub.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // allows frontend JS requests
public class AuthController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = new User();
            user.setName(body.get("name"));
            user.setEmail(body.get("email"));
            user.setPasswordHash(body.get("password"));
            user.setRole(body.getOrDefault("role", "user")); // optional

            userService.register(user);

            response.put("success", true);
            response.put("message", "User registered successfully!");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // Login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = body.get("email");
            String password = body.get("password");
            String role = body.get("role");

            User user = userService.login(email, password, role);

            response.put("success", true);
            response.put("message", "Login successful");
            // redirect URL for frontend
            response.put("redirectUrl", role.equals("admin") ? "/admin/dashboard.html" : "/user/dashboard.html");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
