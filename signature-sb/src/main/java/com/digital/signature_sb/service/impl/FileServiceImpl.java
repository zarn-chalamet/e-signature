package com.digital.signature_sb.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.digital.signature_sb.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadPdf(MultipartFile file) throws IOException {
        // Extract original filename
        String originalFilename = file.getOriginalFilename();
        String baseName = originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "file";

        // Add timestamp for uniqueness
        String timestamp = java.time.LocalDateTime.now()
                .toString()
                .replace(":", "-"); // replace ":" because it's invalid in filenames

        // Build unique filename
        String uniqueFileName = timestamp + "_" + baseName;

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "pdf-templates",
                        "public_id", uniqueFileName
                )
        );

        return (String) uploadResult.get("secure_url"); // public URL
    }
}
