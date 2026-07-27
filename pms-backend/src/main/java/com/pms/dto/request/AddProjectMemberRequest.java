package com.pms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProjectMemberRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Role id is required")
    private Long roleId;
}
