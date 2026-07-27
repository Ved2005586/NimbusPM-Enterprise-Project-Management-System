package com.pms.config;

import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.enums.RoleName;
import com.pms.repository.RoleRepository;
import com.pms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Seeds default roles and a bootstrap ADMIN user on application startup.
 * Safe to run repeatedly - only inserts data that doesn't already exist.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() -> {
                log.info("Seeding role: {}", roleName);
                return roleRepository.save(Role.builder().name(roleName).build());
            });
        }

        if (!userRepository.existsByEmail("admin@pms.com")) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
            User admin = User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@pms.com")
                    .password(passwordEncoder.encode("Admin@12345"))
                    .roles(Set.of(adminRole))
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin user: admin@pms.com / Admin@12345 (change this immediately)");
        }
    }
}
