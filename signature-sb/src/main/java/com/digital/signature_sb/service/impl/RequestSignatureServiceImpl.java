package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.dto.RequestSignatureDtoForRequest;
import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.exception.RequestSignatureDocumentNotFoundException;
import com.digital.signature_sb.mapper.RequestSignatureMapper;
import com.digital.signature_sb.model.RequestSignatureDocument;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.RequestSignatureRepository;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.service.EmailService;
import com.digital.signature_sb.service.RequestSignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestSignatureServiceImpl implements RequestSignatureService {

    private final RequestSignatureRepository requestSignatureRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public RequestSignatureDtoResponse createRequestSignatureDocument(RequestSignatureDtoForRequest request, String email) {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        // map recipients from DTO → Document
        List<RequestSignatureDocument.Recipient> recipientDocs = RequestSignatureMapper.recipientsDtoToDocument(request);

        RequestSignatureDocument document = RequestSignatureDocument.builder()
                .senderId(user.getId())
                .title(request.getTitle())
                .status("Pending")
                .recipients(recipientDocs)
                .emailSubject(request.getEmailSubject())
                .emailMessage(request.getEmailMessage())
                .templateId(request.getTemplateId())
                .build();
        RequestSignatureDocument savedDocument = requestSignatureRepository.save(document);

        //send email to the recipient
        for (RequestSignatureDocument.Recipient recipient : document.getRecipients()) {
            emailService.sendEmail(user,recipient, document);
        }


        return RequestSignatureMapper.mapToDto(savedDocument);
    }

    @Override
    public List<RequestSignatureDtoResponse> getAllUserRequest(String email) {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        List<RequestSignatureDocument> documentList = requestSignatureRepository.findAllBySenderId(user.getId());

        return documentList.stream().map(RequestSignatureMapper::mapToDto).toList();
    }

    @Override
    public RequestSignatureDtoResponse getRequestSignatureDocById(String requestId) {

        RequestSignatureDocument document = requestSignatureRepository.findById(requestId)
                .orElseThrow(() -> new RequestSignatureDocumentNotFoundException("Request signature not found with id: "+ requestId));


        return RequestSignatureMapper.mapToDto(document);
    }

    @Override
    public List<RequestSignatureDtoResponse> getReceivedRequestsFromOthers(String email) {

        //get uploader (current user)
        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        // filter requests where current user is a recipient
        List<RequestSignatureDocument>  requestSignatureDocuments = requestSignatureRepository.findAll()
                .stream()
                .filter( request -> request.getRecipients()
                        .stream()
                        .anyMatch(recipient -> recipient.getUserId().equals(user.getId())))
                .toList();


        return requestSignatureDocuments.stream()
                .map(RequestSignatureMapper::mapToDto)
                .toList();
    }
}
