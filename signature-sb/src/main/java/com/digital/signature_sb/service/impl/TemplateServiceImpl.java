package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.dto.TemplateDto;
import com.digital.signature_sb.exception.TemplateNotAuthorizedException;
import com.digital.signature_sb.exception.TemplateNotFoundException;
import com.digital.signature_sb.model.TemplateDocument;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.TemplateRepository;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.service.FileService;
import com.digital.signature_sb.service.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateServiceImpl implements TemplateService {

    private final TemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @Override
    public TemplateDto uploadFileAndCreateTemplate(MultipartFile file,
                                                   boolean isPublic,
                                                   String title,
                                                   String email) throws IOException {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        // upload file
//        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
//        Files.createDirectories(uploadPath);
//
//        String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
//        Path targetLocation = uploadPath.resolve(fileName);
//        Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);

        //upload file to cloudinary
        String fileUrl = fileService.uploadPdf(file);

        // create Template Document
        TemplateDocument template = TemplateDocument.builder()
                .fileUrl(fileUrl)
                .uploaderId(user.getId())
                .isPublic(isPublic)
                .title(title)
                .build();
        template = templateRepository.save(template);

        return mapToDto(template);
    }

    @Override
    public List<TemplateDto> getAllPublicTemplates() {

        List<TemplateDocument> templateDocuments = templateRepository.findAll();
        templateDocuments = templateDocuments.stream().filter(TemplateDocument::isPublic).toList();

        return templateDocuments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<TemplateDto> getAllTemplatesByUser(String email) {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        List<TemplateDocument> templateDocuments = templateRepository.findByUploaderId(user.getId());

        return templateDocuments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public TemplateDto getTemplateById(String email, String templateId) {
        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        TemplateDocument templateDocument = templateRepository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: "+templateId));

        //check template is public or not
        //if not public check template's uploader id is user or not
        boolean isOwner = templateDocument.getUploaderId().equals(user.getId());
        if(!templateDocument.isPublic() && !isOwner) {
            throw new TemplateNotAuthorizedException("You don't have access to this template");
        }

        //when user access template in frontend, this template will be added in the recent templates of user
        //remove template first if the template is already in the recent template

        List<UserDocument.RecentTemplate> recentTemplates = user.getRecentTemplates();

        if (recentTemplates == null) {
            recentTemplates = new ArrayList<>();
        }

        // Remove if template already exists
        recentTemplates.removeIf(rt -> rt.getTemplateId().equals(templateId));

        // Add new entry at the top
        recentTemplates.addFirst(UserDocument.RecentTemplate.builder()
                .templateId(templateId)
                .lastOpened(LocalDateTime.now())
                .build());

        // Optional: limit recentTemplates size to 10
        if (recentTemplates.size() > 10) {
            recentTemplates = recentTemplates.subList(0, 10);
        }

        user.setRecentTemplates(recentTemplates);
        log.info("recent template"+recentTemplates);
        userRepository.save(user);

        return mapToDto(templateDocument);
    }

    @Override
    public TemplateDto renameTemplateTitle(String email,
                                           String title,
                                           String templateId) {
        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        TemplateDocument templateDocument = templateRepository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: "+templateId));

        boolean isOwner = templateDocument.getUploaderId().equals(user.getId());
        if(!isOwner){
            throw new TemplateNotAuthorizedException("You don't have permission to handle this template");
        }

        templateDocument.setTitle(title);
        TemplateDocument updatedTemplate = templateRepository.save(templateDocument);

        return mapToDto(updatedTemplate);
    }

    @Override
    public TemplateDto toggleIsPublic(String email,
                                      String templateId) {
        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        TemplateDocument templateDocument = templateRepository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: "+templateId));

        boolean isOwner = templateDocument.getUploaderId().equals(user.getId());
        if(!isOwner){
            throw new TemplateNotAuthorizedException("You don't have permission to handle this template");
        }

        templateDocument.setPublic(!templateDocument.isPublic());
        TemplateDocument updatedTemplate = templateRepository.save(templateDocument);

        return mapToDto(updatedTemplate);
    }

    @Override
    public void deleteByTemplateById(String email,
                                     String templateId) throws IOException {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        TemplateDocument templateDocument = templateRepository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: "+templateId));

        boolean isOwner = templateDocument.getUploaderId().equals(user.getId());
        if(!isOwner){
            throw new TemplateNotAuthorizedException("You don't have permission to handle this template");
        }

        //delete file from cloudinary

//        try{
//            //delete file
//            Path filePath = Paths.get(templateDocument.getFileUrl());
//            Files.deleteIfExists(filePath);
//        } catch (IOException e) {
//            log.error("Failed to delete file: "+ templateDocument.getFileUrl());
//        }

        //remove the template from the recent templates of all users
        List<UserDocument> allUsers = userRepository.findAll();
        for (UserDocument u : allUsers) {
            if (u.getRecentTemplates() != null) {
                boolean removed = u.getRecentTemplates().removeIf(rt -> rt.getTemplateId().equals(templateId));
                if (removed) {
                    userRepository.save(u);
                }
            }
        }


        //delete template
        templateRepository.delete(templateDocument);

    }

    @Override
    public TemplateDto getDownloadableFile(String templateId) {

        TemplateDocument templateDocument = templateRepository.findById(templateId)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: "+ templateId));

        return mapToDto(templateDocument);
    }

    private TemplateDto mapToDto(TemplateDocument templateDocument) {
        return TemplateDto.builder()
                .id(templateDocument.getId())
                .uploaderId(templateDocument.getUploaderId())
                .uploadedAt(templateDocument.getUploadedAt())
                .title(templateDocument.getTitle())
                .fileUrl(templateDocument.getFileUrl())
                .frequency(templateDocument.getFrequency())
                .isPublic(templateDocument.isPublic())
                .build();
    }
}
