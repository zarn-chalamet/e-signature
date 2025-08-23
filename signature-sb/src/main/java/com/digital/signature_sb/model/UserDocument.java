package com.digital.signature_sb.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDocument {

    @Id
    private String id;
    private Role role;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean isRestricted;
    private String imageUrl;
    @CreatedDate
    private LocalDateTime createdAt;

    private List<RecentTemplate> recentTemplates;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RecentTemplate {
        private String templateId;
        private LocalDateTime lastOpened;
    }
}
