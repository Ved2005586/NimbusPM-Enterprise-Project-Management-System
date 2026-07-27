package com.pms.service;

import com.pms.dto.request.UpdatePreferencesRequest;
import com.pms.dto.request.UpdateProfileRequest;
import com.pms.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getById(Long id);
    List<UserResponse> getAll();
    List<UserResponse> search(String query);
    UserResponse updateProfile(Long id, UpdateProfileRequest request);
    UserResponse updatePreferences(Long id, UpdatePreferencesRequest request);
    UserResponse deactivate(Long id);
    UserResponse activate(Long id);
    void delete(Long id);
}