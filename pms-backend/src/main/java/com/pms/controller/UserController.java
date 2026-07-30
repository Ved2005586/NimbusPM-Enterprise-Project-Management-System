package com.pms.controller;

import com.pms.dto.request.UpdatePreferencesRequest;
import com.pms.dto.request.UpdateProfileRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.UserResponse;
import com.pms.service.UserService;
import com.pms.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and admin user management endpoints")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    @Operation(summary = "Get the currently authenticated user's profile")
    public ApiResponse<UserResponse> getCurrentUser() {
        return ApiResponse.success(userService.getById(securityUtils.getCurrentUserId()));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update the currently authenticated user's profile")
    public ApiResponse<UserResponse> updateCurrentUser(@Valid @RequestBody UpdateProfileRequest request) {
        UserResponse updated = userService.updateProfile(securityUtils.getCurrentUserId(), request);
        return ApiResponse.success("Profile updated", updated);
    }

    @PatchMapping("/me/preferences")
    @Operation(summary = "Update the currently authenticated user's notification preferences")
    public ApiResponse<UserResponse> updateCurrentUserPreferences(@Valid @RequestBody UpdatePreferencesRequest request) {
        UserResponse updated = userService.updatePreferences(securityUtils.getCurrentUserId(), request);
        return ApiResponse.success("Preferences updated", updated);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user by id")
    public ApiResponse<UserResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(userService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all users")
    public ApiResponse<List<UserResponse>> getAll() {
        return ApiResponse.success(userService.getAll());
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by name or email")
    public ApiResponse<List<UserResponse>> search(@RequestParam String query) {
        return ApiResponse.success(userService.search(query));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate a user account (admin only)")
    public ApiResponse<UserResponse> deactivate(@PathVariable Long id) {
        return ApiResponse.success("User deactivated", userService.deactivate(id));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reactivate a user account (admin only)")
    public ApiResponse<UserResponse> activate(@PathVariable Long id) {
        return ApiResponse.success("User activated", userService.activate(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permanently delete a user (admin only)")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ApiResponse.success("User deleted", null);
    }
}
