package com.pms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SprintRequest {

    @NotBlank(message = "Sprint name is required")
    private String name;

    private String goal;

    @NotNull(message = "Project id is required")
    private Long projectId;

    private LocalDate startDate;

    private LocalDate endDate;
}
