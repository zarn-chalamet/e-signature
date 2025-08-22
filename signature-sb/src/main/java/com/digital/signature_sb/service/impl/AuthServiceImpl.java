package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.dto.LoginRequestDto;
import com.digital.signature_sb.dto.UserDto.UserDto;
import com.digital.signature_sb.exception.UserAlreadyExistException;
import com.digital.signature_sb.model.Role;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.security.UserDetailsImpl;
import com.digital.signature_sb.security.jwt.JwtAuthResponse;
import com.digital.signature_sb.security.jwt.JwtTokenProvider;
import com.digital.signature_sb.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDto createNewUser(UserDto userDto) {

        //check the user exists or not
        boolean userExists = userRepository.existsByEmail(userDto.getEmail());
        if(userExists){
            throw new UserAlreadyExistException("User already registered with email: "+userDto.getEmail());
        }

        //save new user
        UserDocument newUser = UserDocument.builder()
                .role(Role.USER_ROLE)
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .isRestricted(userDto.isRestricted())
                .imageUrl(userDto.getImageUrl())
                .build();
        newUser = userRepository.save(newUser);

        //return dto
        return UserDto.builder()
                .id(newUser.getId())
                .firstName(newUser.getFirstName())
                .lastName(newUser.getLastName())
                .email(newUser.getEmail())
                .password(newUser.getPassword())
                .role(newUser.getRole())
                .createdAt(newUser.getCreatedAt())
                .imageUrl(newUser.getImageUrl())
                .isRestricted(newUser.isRestricted())
                .build();
    }

    @Override
    public JwtAuthResponse authenticateUser(LoginRequestDto loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(userDetails);

        return new JwtAuthResponse(jwt);
    }
}
