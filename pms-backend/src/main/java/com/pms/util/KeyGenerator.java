package com.pms.util;

import java.security.SecureRandom;
import java.util.Base64;

public final class KeyGenerator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private KeyGenerator() {
    }

    public static String generateToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
