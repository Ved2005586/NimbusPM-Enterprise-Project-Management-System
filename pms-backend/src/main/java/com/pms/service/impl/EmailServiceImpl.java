package com.pms.service.impl;

import com.pms.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    @Async
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        String body = "Hi " + firstName + ",<br/><br/>Please verify your email by clicking " +
                "<a href=\"" + link + "\">this link</a>. This link expires in 24 hours.";
        send(toEmail, "Verify your PMS account", body);
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        String body = "Hi " + firstName + ",<br/><br/>You requested a password reset. Click " +
                "<a href=\"" + link + "\">here</a> to set a new password. If you did not request this, ignore this email.";
        send(toEmail, "Reset your PMS password", body);
    }

    @Override
    @Async
    public void sendTaskAssignedEmail(String toEmail, String firstName, String taskTitle, String taskKey) {
        String body = "Hi " + firstName + ",<br/><br/>You have been assigned task <b>" + taskKey + " - " +
                taskTitle + "</b>. Log in to the dashboard to view details.";
        send(toEmail, "New task assigned: " + taskKey, body);
    }

    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException | org.springframework.mail.MailException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
