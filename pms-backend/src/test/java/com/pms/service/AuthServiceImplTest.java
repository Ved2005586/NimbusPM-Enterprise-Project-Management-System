package com.pms.service;

import com.pms.dto.request.RegisterRequest;
import com.pms.dto.response.AuthResponse;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.enums.RoleName;
import com.pms.exception.DuplicateResourceException;
import com.pms.mapper.UserMapper;
import com.pms.repository.RefreshTokenRepository;
import com.pms.repository.RoleRepository;
import com.pms.repository.UserRepository;
import com.pms.repository.VerificationTokenRepository;
import com.pms.security.JwtTokenProvider;
import com.pms.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private VerificationTokenRepository verificationTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private UserMapper userMapper;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationMs", 604800000L);

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("jane.doe@example.com");
        registerRequest.setPassword("SecurePass123");
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldCreateUser_withDefaultDeveloperRole() {
        Role developerRole = Role.builder().name(RoleName.DEVELOPER).build();
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(roleRepository.findByName(RoleName.DEVELOPER)).thenReturn(Optional.of(developerRole));
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("hashed-password");

        User savedUser = User.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Doe")
                .email(registerRequest.getEmail())
                .password("hashed-password")
                .roles(Set.of(developerRole))
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtTokenProvider.generateAccessTokenFromEmail(anyString(), any())).thenReturn("access-token");
        when(userMapper.toResponse(any(User.class))).thenReturn(null);

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
        verify(emailService).sendVerificationEmail(eq(registerRequest.getEmail()), eq("Jane"), anyString());
        verify(refreshTokenRepository).save(any());
    }
}
