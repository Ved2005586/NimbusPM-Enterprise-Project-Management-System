package com.pms.service;

import com.pms.dto.response.NotificationResponse;
import com.pms.dto.response.PageResponse;
import com.pms.entity.User;
import com.pms.enums.NotificationType;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void notify(User recipient, NotificationType type, String message, String link);
    PageResponse<NotificationResponse> getForCurrentUser(Pageable pageable);
    void markAsRead(Long id);
    long unreadCount();
}
