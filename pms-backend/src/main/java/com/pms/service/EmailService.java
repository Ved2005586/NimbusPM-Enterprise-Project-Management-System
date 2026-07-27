package com.pms.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String firstName, String token);
    void sendPasswordResetEmail(String toEmail, String firstName, String token);
    void sendTaskAssignedEmail(String toEmail, String firstName, String taskTitle, String taskKey);
}
