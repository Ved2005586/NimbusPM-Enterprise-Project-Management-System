package com.pms.mapper;

import com.pms.dto.response.ProjectResponse;
import com.pms.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        if (project == null) return null;
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .projectKey(project.getProjectKey())
                .description(project.getDescription())
                .status(project.getStatus().name())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .archived(project.isArchived())
                .memberCount(project.getMembers() != null ? project.getMembers().size() : 0)
                .build();
    }
}
