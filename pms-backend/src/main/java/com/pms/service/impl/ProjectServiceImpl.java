package com.pms.service.impl;

import com.pms.dto.request.AddProjectMemberRequest;
import com.pms.dto.request.ProjectRequest;
import com.pms.dto.response.ProjectResponse;
import com.pms.entity.*;
import com.pms.exception.BadRequestException;
import com.pms.exception.DuplicateResourceException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.ProjectMapper;
import com.pms.repository.*;
import com.pms.service.ProjectService;
import com.pms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectMapper projectMapper;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        if (projectRepository.existsByProjectKey(request.getProjectKey().toUpperCase())) {
            throw new DuplicateResourceException("A project with key " + request.getProjectKey() + " already exists");
        }

        User owner = securityUtils.getCurrentUser();

        Project project = Project.builder()
                .name(request.getName())
                .projectKey(request.getProjectKey().toUpperCase())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .owner(owner)
                .build();

        project = projectRepository.save(project);
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = findProject(id);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Project project = findProject(id);
        projectRepository.delete(project);
    }

    @Override
    @Transactional
    public ProjectResponse archive(Long id) {
        Project project = findProject(id);
        project.setArchived(true);
        project.setStatus(com.pms.enums.ProjectStatus.ARCHIVED);
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse getById(Long id) {
        return projectMapper.toResponse(findProject(id));
    }

    @Override
    public List<ProjectResponse> getAllForCurrentUser() {
        return projectRepository.findAll().stream().map(projectMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public ProjectResponse addMember(Long projectId, AddProjectMemberRequest request) {
        Project project = findProject(projectId);
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));

        if (projectMemberRepository.existsByProjectAndUser(project, user)) {
            throw new BadRequestException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .projectRole(role)
                .build();
        projectMemberRepository.save(member);

        return projectMapper.toResponse(findProject(projectId));
    }

    @Override
    @Transactional
    public void removeMember(Long projectId, Long userId) {
        Project project = findProject(projectId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        projectMemberRepository.deleteByProjectAndUser(project, user);
    }

    @Override
    public List<ProjectResponse> search(String query) {
        return projectRepository.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(query.toLowerCase())
                        || p.getProjectKey().toLowerCase().contains(query.toLowerCase()))
                .map(projectMapper::toResponse)
                .toList();
    }

    private Project findProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }
}
