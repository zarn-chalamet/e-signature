package com.digital.signature_sb.dto;

import com.digital.signature_sb.model.Role;
import com.digital.signature_sb.model.UserDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

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

    private List<UserDocument.RecentTemplate> recentTemplates;

}
