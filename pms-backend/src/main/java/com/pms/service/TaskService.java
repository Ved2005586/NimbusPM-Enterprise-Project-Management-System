package com.pms.service;

import com.pms.dto.request.TaskCommentRequest;
import com.pms.dto.request.TaskRequest;
import com.pms.dto.request.TaskStatusUpdateRequest;
import com.pms.dto.response.TaskCommentResponse;
import com.pms.dto.response.TaskResponse;

import java.util.List;

public interface TaskService {
    TaskResponse create(TaskRequest request);
    TaskResponse update(Long id, TaskRequest request);
    void delete(Long id);
    TaskResponse getById(Long id);
    List<TaskResponse> getByProject(Long projectId);
    TaskResponse updateStatus(Long id, TaskStatusUpdateRequest request);
    TaskResponse assign(Long id, Long userId);
    TaskCommentResponse addComment(Long taskId, TaskCommentRequest request);
    List<TaskCommentResponse> getComments(Long taskId);
    List<TaskResponse> search(String query);
}
