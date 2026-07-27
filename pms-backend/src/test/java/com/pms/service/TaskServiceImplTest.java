package com.pms.service;

import com.pms.dto.request.TaskRequest;
import com.pms.entity.Project;
import com.pms.entity.Task;
import com.pms.entity.User;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.TaskCommentMapper;
import com.pms.mapper.TaskMapper;
import com.pms.repository.*;
import com.pms.service.impl.TaskServiceImpl;
import com.pms.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock private TaskRepository taskRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private SprintRepository sprintRepository;
    @Mock private UserRepository userRepository;
    @Mock private TaskCommentRepository taskCommentRepository;
    @Mock private TaskHistoryRepository taskHistoryRepository;
    @Mock private TaskMapper taskMapper;
    @Mock private TaskCommentMapper taskCommentMapper;
    @Mock private SecurityUtils securityUtils;
    @Mock private NotificationService notificationService;
    @Mock private EmailService emailService;
    @Mock private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TaskServiceImpl taskService;

    private TaskRequest taskRequest;

    @BeforeEach
    void setUp() {
        taskRequest = new TaskRequest();
        taskRequest.setTitle("Implement login page");
        taskRequest.setProjectId(1L);
    }

    @Test
    void create_shouldThrow_whenProjectNotFound() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.create(taskRequest));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void create_shouldSaveTask_withGeneratedKey_whenProjectExists() {
        Project project = Project.builder().id(1L).name("Website Revamp").projectKey("WEB").build();
        User reporter = User.builder().id(9L).firstName("Sam").build();

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(securityUtils.getCurrentUser()).thenReturn(reporter);
        when(taskRepository.findMaxPositionInColumn(any(), any())).thenReturn(0);
        when(taskRepository.count()).thenReturn(4L);
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));
        // broadcastTaskUpdate() calls taskMapper.toResponse(task) before sending over the socket;
        // without this stub the mock returns null and the any() matcher below won't match it.
        when(taskMapper.toResponse(any(Task.class))).thenReturn(
                com.pms.dto.response.TaskResponse.builder().id(1L).taskKey("WEB-5").build()
        );

        taskService.create(taskRequest);

        verify(taskRepository).save(any(Task.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/projects/1/tasks"), any(Object.class));
    }
}
