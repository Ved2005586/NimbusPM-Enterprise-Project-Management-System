package com.pms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String projectKey;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private UserResponse owner;
    private int memberCount;
    private int taskCount;
    private boolean archived;
}
