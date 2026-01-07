package com.shophub.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shophub.model.User;
import com.shophub.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(User user) throws Exception {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            throw new Exception("Email already registered");
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password, String role) throws Exception {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new Exception("Email not found");
        }
        User user = userOpt.get();
        if (!user.getRole().equals(role)) {
            throw new Exception("Role mismatch");
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new Exception("Invalid password");
        }
        return user;
    }
}
