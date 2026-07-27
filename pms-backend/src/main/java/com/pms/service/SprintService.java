package com.pms.service;

import com.pms.dto.request.SprintRequest;
import com.pms.dto.response.SprintResponse;

import java.util.List;

public interface SprintService {
    SprintResponse create(SprintRequest request);
    SprintResponse start(Long id);
    SprintResponse complete(Long id);
    List<SprintResponse> getByProject(Long projectId);
    SprintResponse getById(Long id);
}
