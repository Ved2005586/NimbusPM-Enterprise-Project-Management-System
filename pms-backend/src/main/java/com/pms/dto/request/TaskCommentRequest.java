package com.pms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskCommentRequest {

    @NotBlank(message = "Comment content is required")
    @jakarta.validation.constraints.Size(max = 3000)
    private String content;
}
