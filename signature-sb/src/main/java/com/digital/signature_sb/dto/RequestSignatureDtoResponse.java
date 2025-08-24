package com.digital.signature_sb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestSignatureDtoResponse {

    private String id;
    private String senderId;
    private String title;
    private String status;

    private List<RecipientDto> recipients;

    private String emailSubject;
    private String emailMessage;

    private String templateId;

    private List<PdfVersionDto> pdfVersions;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- Nested DTOs ---
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RecipientDto {
        private String userId;
        private boolean signed;
        private List<SignaturePositionDto> signaturePositions;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignaturePositionDto {
        private int page;
        private float x;
        private float y;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PdfVersionDto {
        private int version;
        private String fileUrl;
        private SignedByDto signedBy;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignedByDto {
        private String userId;
        private LocalDateTime signedAt;
    }
}
