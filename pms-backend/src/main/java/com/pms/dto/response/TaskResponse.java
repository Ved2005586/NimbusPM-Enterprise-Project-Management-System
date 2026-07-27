package com.pms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String taskKey;
    private String title;
    private String description;
    private Long projectId;
    private Long sprintId;
    private UserResponse assignee;
    private UserResponse reporter;
    private Long parentTaskId;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Integer storyPoints;
    private Set<String> labels;
    private int position;
}
