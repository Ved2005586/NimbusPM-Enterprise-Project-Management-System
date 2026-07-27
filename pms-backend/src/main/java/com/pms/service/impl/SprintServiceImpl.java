package com.pms.service.impl;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.SprintResponse;
import com.pms.entity.Project;
import com.pms.entity.Sprint;
import com.pms.enums.SprintStatus;
import com.pms.exception.BadRequestException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.SprintMapper;
import com.pms.repository.ProjectRepository;
import com.pms.repository.SprintRepository;
import com.pms.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final SprintMapper sprintMapper;

    @Override
    @Transactional
    public SprintResponse create(SprintRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        Sprint sprint = Sprint.builder()
                .name(request.getName())
                .goal(request.getGoal())
                .project(project)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return sprintMapper.toResponse(sprintRepository.save(sprint));
    }

    @Override
    @Transactional
    public SprintResponse start(Long id) {
        Sprint sprint = findSprint(id);
        if (sprint.getStatus() != SprintStatus.PLANNED) {
            throw new BadRequestException("Only planned sprints can be started");
        }
        sprint.setStatus(SprintStatus.ACTIVE);
        return sprintMapper.toResponse(sprintRepository.save(sprint));
    }

    @Override
    @Transactional
    public SprintResponse complete(Long id) {
        Sprint sprint = findSprint(id);
        if (sprint.getStatus() != SprintStatus.ACTIVE) {
            throw new BadRequestException("Only active sprints can be completed");
        }
        sprint.setStatus(SprintStatus.COMPLETED);
        return sprintMapper.toResponse(sprintRepository.save(sprint));
    }

    @Override
    public List<SprintResponse> getByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return sprintRepository.findByProjectOrderByStartDateDesc(project).stream()
                .map(sprintMapper::toResponse)
                .toList();
    }

    @Override
    public SprintResponse getById(Long id) {
        return sprintMapper.toResponse(findSprint(id));
    }

    private Sprint findSprint(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));
    }
}
