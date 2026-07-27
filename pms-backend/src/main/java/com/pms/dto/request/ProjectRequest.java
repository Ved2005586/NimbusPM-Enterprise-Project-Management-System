package com.pms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Project key is required")
    @Size(max = 20, message = "Project key must be at most 20 characters")
    private String projectKey;

    @Size(max = 2000)
    private String description;

    private LocalDate startDate;

    private LocalDate endDate;
}
