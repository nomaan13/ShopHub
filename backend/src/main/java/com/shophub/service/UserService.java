package com.shophub.service;

import com.shophub.model.User;

public interface UserService {

    User register(User user) throws Exception;

    User login(String email, String password, String role) throws Exception;
}
