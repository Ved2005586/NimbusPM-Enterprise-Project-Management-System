package com.pms.controller;

import com.pms.dto.request.AddProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.ProjectResponse;
import com.pms.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project CRUD, membership, and search endpoints")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Create a new project")
    public ResponseEntity<ApiResponse<ProjectResponse>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created", projectService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Update a project")
    public ApiResponse<ProjectResponse> update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ApiResponse.success("Project updated", projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Delete a project")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ApiResponse.success("Project deleted", null);
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Archive a project")
    public ApiResponse<ProjectResponse> archive(@PathVariable Long id) {
        return ApiResponse.success("Project archived", projectService.archive(id));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a project by id")
    public ApiResponse<ProjectResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(projectService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List projects visible to the current user")
    public ApiResponse<List<ProjectResponse>> getAll() {
        return ApiResponse.success(projectService.getAllForCurrentUser());
    }

    @GetMapping("/search")
    @Operation(summary = "Search projects by name or key")
    public ApiResponse<List<ProjectResponse>> search(@RequestParam String query) {
        return ApiResponse.success(projectService.search(query));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Add a member to a project")
    public ApiResponse<ProjectResponse> addMember(@PathVariable Long id, @Valid @RequestBody AddProjectMemberRequest request) {
        return ApiResponse.success("Member added", projectService.addMember(id, request));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    @Operation(summary = "Remove a member from a project")
    public ApiResponse<Void> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        projectService.removeMember(id, userId);
        return ApiResponse.success("Member removed", null);
    }
}
