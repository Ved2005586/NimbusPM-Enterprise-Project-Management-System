package com.pms.dto.request;

import com.pms.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private Long sprintId;

    private Long assigneeId;

    private Long parentTaskId;

    private TaskPriority priority;

    private LocalDate dueDate;

    private Integer storyPoints;

    private Set<String> labels;
}
