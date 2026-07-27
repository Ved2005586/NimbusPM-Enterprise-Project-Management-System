package com.pms.service;

import com.pms.dto.request.AddProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {
    ProjectResponse create(ProjectRequest request);
    ProjectResponse update(Long id, ProjectRequest request);
    void delete(Long id);
    ProjectResponse archive(Long id);
    ProjectResponse getById(Long id);
    List<ProjectResponse> getAllForCurrentUser();
    ProjectResponse addMember(Long projectId, AddProjectMemberRequest request);
    void removeMember(Long projectId, Long userId);
    List<ProjectResponse> search(String query);
}
