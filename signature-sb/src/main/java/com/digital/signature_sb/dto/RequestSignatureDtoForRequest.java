package com.digital.signature_sb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestSignatureDtoForRequest {

    private String title;

    private List<RecipientDto> recipients;

    private String templateId;

    private String emailSubject;
    private String emailMessage;

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


}
