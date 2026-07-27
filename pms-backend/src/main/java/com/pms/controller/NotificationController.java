package com.pms.controller;

import com.pms.dto.response.ApiResponse;
import com.pms.dto.response.PageResponse;
import com.pms.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Real-time and persisted notification endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get paginated notifications for the current user")
    public ApiResponse<PageResponse<?>> getAll(Pageable pageable) {
        PageResponse<?> page = notificationService.getForCurrentUser(pageable);
        return ApiResponse.success(page);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications")
    public ApiResponse<Long> unreadCount() {
        return ApiResponse.success(notificationService.unreadCount());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success("Marked as read", null);
    }
}
