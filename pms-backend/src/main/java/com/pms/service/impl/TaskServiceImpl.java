package com.pms.service.impl;

import com.pms.dto.request.TaskCommentRequest;
import com.pms.dto.request.TaskRequest;
import com.pms.dto.request.TaskStatusUpdateRequest;
import com.pms.dto.response.TaskCommentResponse;
import com.pms.dto.response.TaskResponse;
import com.pms.entity.*;
import com.pms.enums.NotificationType;
import com.pms.enums.TaskStatus;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.TaskCommentMapper;
import com.pms.mapper.TaskMapper;
import com.pms.repository.*;
import com.pms.service.EmailService;
import com.pms.service.NotificationService;
import com.pms.service.TaskService;
import com.pms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final TaskHistoryRepository taskHistoryRepository;
    private final TaskMapper taskMapper;
    private final TaskCommentMapper taskCommentMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public TaskResponse create(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        User reporter = securityUtils.getCurrentUser();

        Sprint sprint = null;
        if (request.getSprintId() != null) {
            sprint = sprintRepository.findById(request.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.getSprintId()));
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssigneeId()));
        }

        Task parent = null;
        if (request.getParentTaskId() != null) {
            parent = taskRepository.findById(request.getParentTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent task not found with id: " + request.getParentTaskId()));
        }

        int nextPosition = taskRepository.findMaxPositionInColumn(project, TaskStatus.BACKLOG) + 1;
        String taskKey = project.getProjectKey() + "-" + (taskRepository.count() + 1);

        Task task = Task.builder()
                .taskKey(taskKey)
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .sprint(sprint)
                .assignee(assignee)
                .reporter(reporter)
                .parentTask(parent)
                .priority(request.getPriority() != null ? request.getPriority() : com.pms.enums.TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .storyPoints(request.getStoryPoints())
                .labels(request.getLabels())
                .position(nextPosition)
                .build();

        task = taskRepository.save(task);

        if (assignee != null) {
            notificationService.notify(assignee, NotificationType.TASK_ASSIGNED,
                    "You were assigned to " + task.getTaskKey() + ": " + task.getTitle(),
                    "/tasks/" + task.getId());
            if (assignee.isEmailNotificationsEnabled()) {
                emailService.sendTaskAssignedEmail(assignee.getEmail(), assignee.getFirstName(),
                        task.getTitle(), task.getTaskKey());
            }
        }

        broadcastTaskUpdate(task);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        Task task = findTask(id);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setStoryPoints(request.getStoryPoints());
        if (request.getLabels() != null) task.setLabels(request.getLabels());

        if (request.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(request.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + request.getSprintId()));
            task.setSprint(sprint);
        }

        task = taskRepository.save(task);
        broadcastTaskUpdate(task);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Task task = findTask(id);
        taskRepository.delete(task);
    }

    @Override
    public TaskResponse getById(Long id) {
        return taskMapper.toResponse(findTask(id));
    }

    @Override
    public List<TaskResponse> getByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return taskRepository.findByProjectOrderByPositionAsc(project).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(Long id, TaskStatusUpdateRequest request) {
        Task task = findTask(id);
        User currentUser = securityUtils.getCurrentUser();

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task.setPosition(request.getPosition());
        task = taskRepository.save(task);

        if (!Objects.equals(oldStatus, task.getStatus())) {
            TaskHistory history = TaskHistory.builder()
                    .task(task)
                    .changedBy(currentUser)
                    .fieldChanged("status")
                    .oldValue(oldStatus.name())
                    .newValue(task.getStatus().name())
                    .build();
            taskHistoryRepository.save(history);

            if (task.getStatus() == TaskStatus.DONE && task.getAssignee() != null) {
                notificationService.notify(task.getAssignee(), NotificationType.TASK_COMPLETED,
                        task.getTaskKey() + " was marked as done", "/tasks/" + task.getId());
            }
        }

        broadcastTaskUpdate(task);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse assign(Long id, Long userId) {
        Task task = findTask(id);
        User assignee = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        task.setAssignee(assignee);
        task = taskRepository.save(task);

        notificationService.notify(assignee, NotificationType.TASK_ASSIGNED,
                "You were assigned to " + task.getTaskKey() + ": " + task.getTitle(),
                "/tasks/" + task.getId());
        if (assignee.isEmailNotificationsEnabled()) {
            emailService.sendTaskAssignedEmail(assignee.getEmail(), assignee.getFirstName(),
                    task.getTitle(), task.getTaskKey());
        }

        broadcastTaskUpdate(task);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    public TaskCommentResponse addComment(Long taskId, TaskCommentRequest request) {
        Task task = findTask(taskId);
        User author = securityUtils.getCurrentUser();

        TaskComment comment = TaskComment.builder()
                .task(task)
                .author(author)
                .content(request.getContent())
                .build();
        comment = taskCommentRepository.save(comment);

        if (task.getAssignee() != null && !task.getAssignee().getId().equals(author.getId())) {
            notificationService.notify(task.getAssignee(), NotificationType.COMMENT_ADDED,
                    author.getFullName() + " commented on " + task.getTaskKey(), "/tasks/" + task.getId());
        }

        TaskCommentResponse response = taskCommentMapper.toResponse(comment);
        messagingTemplate.convertAndSend("/topic/tasks/" + taskId + "/comments", response);
        return response;
    }

    @Override
    public List<TaskCommentResponse> getComments(Long taskId) {
        Task task = findTask(taskId);
        return taskCommentRepository.findByTaskOrderByCreatedAtAsc(task).stream()
                .map(taskCommentMapper::toResponse)
                .toList();
    }

    @Override
    public List<TaskResponse> search(String query) {
        return taskRepository.search(query).stream().map(taskMapper::toResponse).toList();
    }

    private void broadcastTaskUpdate(Task task) {
        messagingTemplate.convertAndSend(
                "/topic/projects/" + task.getProject().getId() + "/tasks",
                taskMapper.toResponse(task));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }
}