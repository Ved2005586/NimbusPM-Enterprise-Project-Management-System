package com.pms.mapper;

import com.pms.dto.response.TaskResponse;
import com.pms.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskMapper {

    private final UserMapper userMapper;

    public TaskResponse toResponse(Task task) {
        if (task == null) return null;
        return TaskResponse.builder()
                .id(task.getId())
                .taskKey(task.getTaskKey())
                .title(task.getTitle())
                .description(task.getDescription())
                .projectId(task.getProject().getId())
                .sprintId(task.getSprint() != null ? task.getSprint().getId() : null)
                .assignee(task.getAssignee() != null ? userMapper.toResponse(task.getAssignee()) : null)
                .reporter(userMapper.toResponse(task.getReporter()))
                .parentTaskId(task.getParentTask() != null ? task.getParentTask().getId() : null)
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .storyPoints(task.getStoryPoints())
                .labels(task.getLabels())
                .position(task.getPosition())
                .build();
    }
}
