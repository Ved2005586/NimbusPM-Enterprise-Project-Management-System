package com.pms.controller;

import com.pms.dto.request.TaskCommentRequest;
import com.pms.dto.request.TaskRequest;
import com.pms.dto.request.TaskStatusUpdateRequest;
import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.TaskCommentResponse;
import com.pms.dto.response.TaskResponse;
import com.pms.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task CRUD, Kanban movement, assignment, and comments")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a task")
    public ResponseEntity<ApiResponse<TaskResponse>> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created", taskService.create(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task details")
    public ApiResponse<TaskResponse> update(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return ApiResponse.success("Task updated", taskService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ApiResponse.success("Task deleted", null);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a task by id")
    public ApiResponse<TaskResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(taskService.getById(id));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all tasks for a project (Kanban board data)")
    public ApiResponse<List<TaskResponse>> getByProject(@PathVariable Long projectId) {
        return ApiResponse.success(taskService.getByProject(projectId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Move a task to a new status/column (drag-and-drop)")
    public ApiResponse<TaskResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return ApiResponse.success("Task moved", taskService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/assign/{userId}")
    @Operation(summary = "Assign a task to a user")
    public ApiResponse<TaskResponse> assign(@PathVariable Long id, @PathVariable Long userId) {
        return ApiResponse.success("Task assigned", taskService.assign(id, userId));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add a comment to a task")
    public ResponseEntity<ApiResponse<TaskCommentResponse>> addComment(@PathVariable Long id, @Valid @RequestBody TaskCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added", taskService.addComment(id, request)));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "List comments for a task")
    public ApiResponse<List<TaskCommentResponse>> getComments(@PathVariable Long id) {
        return ApiResponse.success(taskService.getComments(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search tasks by title or key")
    public ApiResponse<List<TaskResponse>> search(@RequestParam String query) {
        return ApiResponse.success(taskService.search(query));
    }
}
