package com.pms.controller;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.SprintResponse;
import com.pms.service.SprintService;
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
@RequestMapping("/sprints")
@RequiredArgsConstructor
@Tag(name = "Sprints", description = "Sprint lifecycle endpoints")
public class SprintController {

    private final SprintService sprintService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER','TEAM_LEAD')")
    @Operation(summary = "Create a sprint")
    public ResponseEntity<ApiResponse<SprintResponse>> create(@Valid @RequestBody SprintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sprint created", sprintService.create(request)));
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER','TEAM_LEAD')")
    @Operation(summary = "Start a planned sprint")
    public ApiResponse<SprintResponse> start(@PathVariable Long id) {
        return ApiResponse.success("Sprint started", sprintService.start(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER','TEAM_LEAD')")
    @Operation(summary = "Complete an active sprint")
    public ApiResponse<SprintResponse> complete(@PathVariable Long id) {
        return ApiResponse.success("Sprint completed", sprintService.complete(id));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a sprint by id")
    public ApiResponse<SprintResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(sprintService.getById(id));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "List sprints for a project")
    public ApiResponse<List<SprintResponse>> getByProject(@PathVariable Long projectId) {
        return ApiResponse.success(sprintService.getByProject(projectId));
    }
}
