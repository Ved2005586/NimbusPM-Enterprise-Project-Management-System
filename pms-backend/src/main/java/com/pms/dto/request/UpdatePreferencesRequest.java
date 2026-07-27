package com.pms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePreferencesRequest {

    @NotNull(message = "emailNotificationsEnabled is required")
    private Boolean emailNotificationsEnabled;
}