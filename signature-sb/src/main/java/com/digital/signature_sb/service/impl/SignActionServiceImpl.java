package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.exception.NoPdfVersionsFoundException;
import com.digital.signature_sb.exception.RequestSignatureDocumentNotAuthorizedException;
import com.digital.signature_sb.exception.RequestSignatureDocumentNotFoundException;
import com.digital.signature_sb.exception.UserAlreadySignedException;
import com.digital.signature_sb.mapper.RequestSignatureMapper;
import com.digital.signature_sb.model.RequestSignatureDocument;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.RequestSignatureRepository;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.service.SignActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignActionServiceImpl implements SignActionService {

    private final UserRepository userRepository;
    private final RequestSignatureRepository requestSignatureRepository;

    @Override
    public RequestSignatureDtoResponse signByTheCurrentUser(MultipartFile file, String requestId, String email) throws IOException {

        //get current user
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        //get request signature document
        RequestSignatureDocument document = requestSignatureRepository.findById(requestId)
                .orElseThrow(() -> new RequestSignatureDocumentNotFoundException("Request not found with id: "+requestId));

        //check if the user is recipient or not
        boolean isRecipient = false;
        for(RequestSignatureDocument.Recipient recipient : document.getRecipients()) {
            if(recipient.getUserId().equals(user.getId())){
                isRecipient = true;
            }
        }

        if(!isRecipient){
            throw new RequestSignatureDocumentNotAuthorizedException("You have no authorized for this action.");
        }

        //check if user is already signed or not
        for(RequestSignatureDocument.Recipient recipient : document.getRecipients()) {
            if(recipient.getUserId().equals(user.getId())){
                if(recipient.isSigned()){
                    throw new UserAlreadySignedException("You already signed this document.");
                }
            }
        }

        //add file into the upload
        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);

        //add new version number
        int version = document.getPdfVersions() == null ? 1 : document.getPdfVersions().size() + 1;

        if (document.getPdfVersions() == null) {
            document.setPdfVersions(new ArrayList<>());
        }

        document.getPdfVersions().add(
               RequestSignatureDocument.PdfVersion.builder()
                       .version(version)
                       .fileUrl(targetLocation.toString())
                       .signedBy(RequestSignatureDocument.SignedBy.builder()
                               .userId(user.getId())
                               .build())
                       .build()
        );

        //mark user as signed in recipients array
        for(RequestSignatureDocument.Recipient recipient : document.getRecipients()) {
            if(recipient.getUserId().equals(user.getId())){
                if(!recipient.isSigned()){
                    recipient.setSigned(true);
                }
            }
        }

        //check if all recipient have signed
        boolean isAllSigned = document.getRecipients()
                .stream()
                .allMatch(RequestSignatureDocument.Recipient::isSigned);

        if(isAllSigned) {
            document.setStatus("Approved");
        }

        //save the updated request signature document
        RequestSignatureDocument updatedDocument = requestSignatureRepository.save(document);

        return RequestSignatureMapper.mapToDto(updatedDocument);
    }

    @Override
    public RequestSignatureDtoResponse.PdfVersionDto getLatestVersionDownloadablePdfFile(String requestId) {

        //get request signature document
        RequestSignatureDocument document = requestSignatureRepository.findById(requestId)
                .orElseThrow(() -> new RequestSignatureDocumentNotFoundException("Request not found with id: "+requestId));

        //check if PDF version list is null or not
        if(document.getPdfVersions() == null || document.getPdfVersions().isEmpty()) {
            throw new NoPdfVersionsFoundException("No PDF versions available for this document.");
        }

        //extract the latest version of pdf
        RequestSignatureDocument.PdfVersion latestPdfVersion =
                document.getPdfVersions().get(document.getPdfVersions().size() - 1);

        return RequestSignatureDtoResponse.PdfVersionDto
                .builder()
                .version(latestPdfVersion.getVersion())
                .fileUrl(latestPdfVersion.getFileUrl())
                .signedBy(RequestSignatureDtoResponse.SignedByDto
                        .builder()
                        .userId(latestPdfVersion.getSignedBy().getUserId())
                        .signedAt(latestPdfVersion.getSignedBy().getSignedAt())
                        .build())
                .build();
    }
}
