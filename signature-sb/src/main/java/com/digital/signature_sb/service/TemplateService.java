package com.digital.signature_sb.service;

import com.digital.signature_sb.dto.TemplateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TemplateService {
    TemplateDto uploadFileAndCreateTemplate(MultipartFile file, boolean isPublic,String title, String email) throws IOException;

    List<TemplateDto> getAllPublicTemplates();

    List<TemplateDto> getAllTemplatesByUser(String email);

    TemplateDto getTemplateById(String email, String templateId);

    TemplateDto renameTemplateTitle(String email, String title, String templateId);

    TemplateDto toggleIsPublic(String email, String templateId);

    void deleteByTemplateById(String email, String templateId) throws IOException;

    TemplateDto getDownloadableFile(String templateId);
}
