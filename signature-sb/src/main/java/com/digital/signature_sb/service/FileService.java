package com.digital.signature_sb.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    String uploadPdf(MultipartFile file) throws IOException;
}
