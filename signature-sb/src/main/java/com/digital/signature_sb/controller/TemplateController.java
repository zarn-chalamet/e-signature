package com.digital.signature_sb.controller;

import com.digital.signature_sb.dto.TemplateDto;
import com.digital.signature_sb.service.TemplateService;
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
import java.util.List;

@RestController
@RequestMapping("/v1/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    //create template (Both USER and ADMIN can)
    @PostMapping("/create")
    public ResponseEntity<?> createTemplate(@RequestPart("file") MultipartFile file,
                                            @RequestParam("isPublic") boolean isPublic,
                                            @RequestParam("title") String title,
                                            Principal principal) throws IOException {
        String email = principal.getName();
        TemplateDto templateDto = templateService.uploadFileAndCreateTemplate(file,isPublic,title,email);

        return ResponseEntity.ok(templateDto);
    }

    //get all public templates
    @GetMapping("/public-templates")
    public ResponseEntity<?> getAllPublicTemplates() {

        List<TemplateDto> publicTemplates = templateService.getAllPublicTemplates();

        return ResponseEntity.ok(publicTemplates);
    }

    //get all user templates
    @GetMapping("/my-templates")
    public ResponseEntity<?> getAllUserTemplates(Principal principal) {

        String email = principal.getName();
        List<TemplateDto> userTemplates = templateService.getAllTemplatesByUser(email);

        return ResponseEntity.ok(userTemplates);
    }

    //get template by id
    @GetMapping("/{templateId}")
    public ResponseEntity<?> getTemplateById(@PathVariable String templateId,
                                             Principal principal) {

        String email = principal.getName();
        TemplateDto userTemplate = templateService.getTemplateById(email,templateId);

        return ResponseEntity.ok(userTemplate);
    }

    //rename template (Both Authorized USER and Authorized ADMIN can)
    @PatchMapping("/rename/{templateId}")
    public ResponseEntity<?> renameTemplate(@RequestParam("title") String title,
                                            Principal principal,
                                            @PathVariable String templateId) {
        String email = principal.getName();
        TemplateDto template = templateService.renameTemplateTitle(email,title,templateId);

        return ResponseEntity.ok(template);
    }

    //Toggle isPublic (Both Authorized USER and Authorized ADMIN can)
    @PatchMapping("/toggle-public/{templateId}")
    public ResponseEntity<?> toggleIsPublic(Principal principal,
                                            @PathVariable String templateId) {
        String email = principal.getName();
        TemplateDto template = templateService.toggleIsPublic(email,templateId);

        return ResponseEntity.ok(template);
    }

    //Delete Template (Both Authorized USER and Authorized ADMIN can)
    @DeleteMapping("/delete/{templateId}")
    public ResponseEntity<?> deleteTemplate(Principal principal,
                                            @PathVariable String templateId) throws IOException {
        String email = principal.getName();
        templateService.deleteByTemplateById(email,templateId);

        return ResponseEntity.ok("Deleted Template successfully.");
    }

    //Download File
    @GetMapping("/download/{templateId}")
    public ResponseEntity<Resource> download(@PathVariable String templateId) throws IOException {
        TemplateDto downloadableFile = templateService.getDownloadableFile(templateId);

        Path path = Paths.get(downloadableFile.getFileUrl());
        Resource resource = new UrlResource(path.toUri());

        String safeFileName = downloadableFile.getTitle().trim().replace(" ", "-");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+ safeFileName +"\"")
                .body(resource);
    }
}
