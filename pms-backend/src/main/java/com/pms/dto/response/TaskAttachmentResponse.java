package com.pms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAttachmentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String downloadUrl;
    private UserResponse uploadedBy;
}
