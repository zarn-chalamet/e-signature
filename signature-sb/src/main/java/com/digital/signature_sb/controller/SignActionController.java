package com.digital.signature_sb.controller;

import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.dto.TemplateDto;
import com.digital.signature_sb.service.SignActionService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;

@RestController
@RequestMapping("/v1/api/sign")
@RequiredArgsConstructor
public class SignActionController {

    private final SignActionService signActionService;

    //sign by the current user
    @PostMapping("/sign-by-user")
    public ResponseEntity<?> signByCurrentUser(@RequestPart("file") MultipartFile file,
                                               @PathParam("requestId") String requestId,
                                               Principal principal) throws IOException {
        String email = principal.getName();
        RequestSignatureDtoResponse requestSignatureDtoResponse = signActionService.signByTheCurrentUser(file,requestId,email);

        return ResponseEntity.ok(requestSignatureDtoResponse);
    }

    //download the latest pdf version file from the pdfVersions lists
    @GetMapping("/download/{requestId}")
    public ResponseEntity<Resource> downloadLatestPdfVersion(@PathVariable String requestId) throws IOException {
        RequestSignatureDtoResponse.PdfVersionDto downloadableFile = signActionService.getLatestVersionDownloadablePdfFile(requestId);

        //get file url(cloudinary url)
        String fileUrl = downloadableFile.getFileUrl();
        Resource resource = new UrlResource(fileUrl);

        // Extract original file name from URL
        String originalFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

        // Remove the LocalDateTime prefix (everything before the first underscore)
        String safeFileName = originalFileName.contains("_")
                ? originalFileName.substring(originalFileName.indexOf("_") + 1)
                : originalFileName;

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFileName + "\"")
                .body(resource);
    }
}
