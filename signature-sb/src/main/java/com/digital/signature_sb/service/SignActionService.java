package com.digital.signature_sb.service;

import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.dto.TemplateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface SignActionService {
    RequestSignatureDtoResponse signByTheCurrentUser(MultipartFile file, String requestId, String email) throws IOException;


    RequestSignatureDtoResponse.PdfVersionDto getLatestVersionDownloadablePdfFile(String requestId);
}
