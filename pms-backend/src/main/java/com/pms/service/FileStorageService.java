package com.pms.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file, String subDirectory);
    org.springframework.core.io.Resource loadAsResource(String filePath);
}
