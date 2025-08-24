package com.digital.signature_sb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TemplateDto {
    private String id;
    private String uploaderId;
    private String title;
    private LocalDateTime uploadedAt;
    private boolean isPublic;
    private String fileUrl;
    private Integer frequency;
}
