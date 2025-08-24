package com.digital.signature_sb.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "request-signature")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestSignatureDocument {

    @Id
    private String id;

    private String senderId; // User ID reference
    private String title;
    private String status; // "pending", "approved", "rejected"

    private List<Recipient> recipients;

    private String emailSubject;
    private String emailMessage;

    private String templateId; // Template reference

    private List<PdfVersion> pdfVersions;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // --- Embedded Classes ---
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Recipient {
        private String userId;
        private boolean signed;
        private List<SignaturePosition> signaturePositions;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignaturePosition {
        private int page; // PDF Page Number
        private float x;  // X-coordinate
        private float y;  // Y-coordinate
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PdfVersion {
        private int version;
        private String fileUrl;
        private SignedBy signedBy;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignedBy {
        private String userId;

        @CreatedDate
        private LocalDateTime signedAt;
    }

}
