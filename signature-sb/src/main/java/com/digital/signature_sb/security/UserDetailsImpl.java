package com.digital.signature_sb.security;

import com.digital.signature_sb.model.Role;
import com.digital.signature_sb.model.UserDocument;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private String id;
    private String firstName;
    private String lastName;
    private String email;     // maps to username
    private String password;
    private Role role;
    private boolean isRestricted;// e.g., ADMIN, USER

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map role -> Spring Security authority
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password; // return actual password
    }

    @Override
    public String getUsername() {
        return email; // use email as the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // you can add logic later if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // add logic if you want to lock users
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // add logic for password expiration
    }

    @Override
    public boolean isEnabled() {
        return !isRestricted; // map to isRestricted if you want
    }

    // Factory method to convert from UserDocument -> UserDetailsImpl
    public static UserDetailsImpl build(UserDocument user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.isRestricted()
        );
    }
}
