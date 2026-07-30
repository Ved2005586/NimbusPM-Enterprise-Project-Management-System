package com.pms.service.impl;

import com.pms.dto.request.UpdatePreferencesRequest;
import com.pms.dto.request.UpdateProfileRequest;
import com.pms.dto.response.UserResponse;
import com.pms.entity.User;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.UserMapper;
import com.pms.repository.UserRepository;
import com.pms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse getById(Long id) {
        return userMapper.toResponse(findUser(id));
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    @Override
    public List<UserResponse> search(String query) {
        return userRepository.search(query).stream().map(userMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long id, UpdateProfileRequest request) {
        User user = findUser(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updatePreferences(Long id, UpdatePreferencesRequest request) {
        User user = findUser(id);
        user.setEmailNotificationsEnabled(request.getEmailNotificationsEnabled());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse deactivate(Long id) {
        User user = findUser(id);
        user.setEnabled(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse activate(Long id) {
        User user = findUser(id);
        user.setEnabled(true);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) {
        User user = findUser(id);
        userRepository.delete(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
