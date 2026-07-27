package com.pms.controller;

import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.TaskAttachmentResponse;
import com.pms.dto.response.UserResponse;
import com.pms.entity.Task;
import com.pms.entity.TaskAttachment;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.UserMapper;
import com.pms.repository.TaskAttachmentRepository;
import com.pms.repository.TaskRepository;
import com.pms.service.FileStorageService;
import com.pms.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/tasks/{taskId}/attachments")
@RequiredArgsConstructor
@Tag(name = "Task Attachments", description = "Upload and download files attached to tasks")
public class TaskAttachmentController {

    private final TaskAttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final FileStorageService fileStorageService;
    private final SecurityUtils securityUtils;
    private final UserMapper userMapper;

    @PostMapping
    @Operation(summary = "Upload a file attachment to a task")
    public ResponseEntity<ApiResponse<TaskAttachmentResponse>> upload(@PathVariable Long taskId,
                                                                       @RequestParam("file") MultipartFile file) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        String storedPath = fileStorageService.store(file, "tasks/" + taskId);

        TaskAttachment attachment = TaskAttachment.builder()
                .task(task)
                .uploadedBy(securityUtils.getCurrentUser())
                .fileName(file.getOriginalFilename())
                .filePath(storedPath)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .build();
        attachment = attachmentRepository.save(attachment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded", toResponse(attachment)));
    }

    @GetMapping
    @Operation(summary = "List attachments for a task")
    public ApiResponse<List<TaskAttachmentResponse>> list(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        List<TaskAttachmentResponse> attachments = attachmentRepository.findByTask(task).stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.success(attachments);
    }

    @GetMapping("/{attachmentId}/download")
    @Operation(summary = "Download an attachment")
    public ResponseEntity<Resource> download(@PathVariable Long taskId, @PathVariable Long attachmentId) {
        TaskAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));
        Resource resource = fileStorageService.loadAsResource(attachment.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }

    private TaskAttachmentResponse toResponse(TaskAttachment attachment) {
        UserResponse uploader = userMapper.toResponse(attachment.getUploadedBy());
        return TaskAttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .downloadUrl("/api/tasks/" + attachment.getTask().getId() + "/attachments/" + attachment.getId() + "/download")
                .uploadedBy(uploader)
                .build();
    }
}
