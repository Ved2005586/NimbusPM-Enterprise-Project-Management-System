package com.pms.mapper;

import com.pms.dto.response.TaskCommentResponse;
import com.pms.entity.TaskComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskCommentMapper {

    private final UserMapper userMapper;

    public TaskCommentResponse toResponse(TaskComment comment) {
        if (comment == null) return null;
        return TaskCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(userMapper.toResponse(comment.getAuthor()))
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
