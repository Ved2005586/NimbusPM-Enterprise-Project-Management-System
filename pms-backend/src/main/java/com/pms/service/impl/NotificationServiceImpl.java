package com.pms.service.impl;

import com.pms.dto.response.NotificationResponse;
import com.pms.dto.response.PageResponse;
import com.pms.entity.Notification;
import com.pms.entity.User;
import com.pms.enums.NotificationType;
import com.pms.exception.ResourceNotFoundException;
import com.pms.mapper.NotificationMapper;
import com.pms.repository.NotificationRepository;
import com.pms.service.NotificationService;
import com.pms.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SecurityUtils securityUtils;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void notify(User recipient, NotificationType type, String message, String link) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .link(link)
                .build();
        notification = notificationRepository.save(notification);

        // Never send the raw entity here — it carries a lazy-loaded
        // `recipient` association, which Hibernate represents as a proxy
        // object. Jackson can't serialize that proxy's internal machinery
        // (this used to throw MessageConversionException on every
        // notify() call). Always convert to a DTO before it leaves the
        // service layer, same as every REST response already does.
        NotificationResponse response = notificationMapper.toResponse(notification);
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(), "/queue/notifications", response);
    }

    @Override
    public PageResponse<NotificationResponse> getForCurrentUser(Pageable pageable) {
        User user = securityUtils.getCurrentUser();
        Page<Notification> page = notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);
        Page<NotificationResponse> mapped = page.map(notificationMapper::toResponse);
        return PageResponse.from(mapped);
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public long unreadCount() {
        User user = securityUtils.getCurrentUser();
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }
}
