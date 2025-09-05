package com.digital.signature_sb.mapper;

import com.digital.signature_sb.dto.RequestSignatureDtoForRequest;
import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.model.RequestSignatureDocument;

import java.util.List;

public class RequestSignatureMapper {

    public static RequestSignatureDtoResponse mapToDto(RequestSignatureDocument document) {
        return RequestSignatureDtoResponse.builder()
                .id(document.getId())
                .senderId(document.getSenderId())
                .title(document.getTitle())
                .status(document.getStatus())
                .emailSubject(document.getEmailSubject())
                .emailMessage(document.getEmailMessage())
                .templateId(document.getTemplateId())
                .recipients(recipientsDocumentToDto(document.getRecipients()))
                .pdfVersions(pdfVersionsDocumentToDto(document.getPdfVersions()))
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }

    public static List<RequestSignatureDocument.Recipient> recipientsDtoToDocument(RequestSignatureDtoForRequest request) {
        return request.getRecipients().stream()
                .map(r -> RequestSignatureDocument.Recipient.builder()
                        .userId(r.getUserId())
                        .signed(r.isSigned())
                        .signaturePositions(r.getSignaturePositions().stream()
                                .map(pos -> RequestSignatureDocument.SignaturePosition.builder()
                                        .page(pos.getPage())
                                        .x(pos.getX())
                                        .y(pos.getY())
                                        .build()
                                ).toList()
                        )
                        .build()
                ).toList();
    }

    public static List<RequestSignatureDtoResponse.RecipientDto> recipientsDocumentToDto(List<RequestSignatureDocument.Recipient> recipients) {
        return recipients.stream()
                .map(r -> RequestSignatureDtoResponse.RecipientDto.builder()
                        .userId(r.getUserId())
                        .signed(r.isSigned())
                        .signaturePositions(r.getSignaturePositions().stream()
                                .map(pos -> RequestSignatureDtoResponse.SignaturePositionDto.builder()
                                        .page(pos.getPage())
                                        .x(pos.getX())
                                        .y(pos.getY())
                                        .build()
                                ).toList()
                        )
                        .build()
                ).toList();
    }
    public static List<RequestSignatureDtoResponse.PdfVersionDto> pdfVersionsDocumentToDto(List<RequestSignatureDocument.PdfVersion> pdfVersions) {
        if (pdfVersions == null) return null;
        return pdfVersions.stream()
                .map(v -> RequestSignatureDtoResponse.PdfVersionDto.builder()
                        .version(v.getVersion())
                        .fileUrl(v.getFileUrl())
                        .signedBy(v.getSignedBy() != null ?
                                RequestSignatureDtoResponse.SignedByDto.builder()
                                        .userId(v.getSignedBy().getUserId())
                                        .signedAt(v.getSignedBy().getSignedAt())
                                        .build()
                                : null
                        )
                        .build()
                ).toList();
    }
}
