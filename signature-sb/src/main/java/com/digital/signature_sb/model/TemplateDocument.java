package com.digital.signature_sb.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "template")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TemplateDocument {
    @Id
    private String id;
    //uploaded User Id
    private String uploaderId;
    private String title;

    @CreatedDate
    private LocalDateTime uploadedAt;

    private boolean isPublic;
    private String fileUrl;
    private Integer frequency;

}
