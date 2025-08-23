package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.dto.UserDto.UserDto;
import com.digital.signature_sb.exception.UserAlreadyExistException;
import com.digital.signature_sb.model.Role;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
    public List<UserDto> getAllUsers(String email) {
        return userRepository.findAll()
                .stream()
                .filter(user -> !user.getEmail().equals(email)) // exclude current user
                .map(this::mapToDto)
                .collect(Collectors.toList()); // if Java < 16, use .collect(Collectors.toList())
    }


    @Override
    public UserDto toggleUserRestricted(String userId) {
        UserDocument user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found with id: "+userId));
        user.setRestricted(!user.isRestricted());
        userRepository.save(user);
        return mapToDto(user);
    }

    @Override
    public UserDto updateUserById(String userId, UserDto userDto) {
        UserDocument user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found with id: "+userId));

        if(userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }

        if(userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }

        if(userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }

        if(userDto.getImageUrl() != null) {
            user.setImageUrl(userDto.getImageUrl());
        }

        user = userRepository.save(user);

        return mapToDto(user);
    }

    @Override
    public void deleteUserById(String userId) {
        UserDocument user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found with id: "+userId));

        userRepository.deleteById(userId);
    }

    @Override
    public UserDto getCurrentUserProfile(String email) {

        UserDocument user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: "+email));

        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .imageUrl(user.getImageUrl())
                .isRestricted(user.isRestricted())
                .build();
    }

    private UserDto mapToDto(UserDocument user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .password(user.getPassword())
                .createdAt(user.getCreatedAt())
                .imageUrl(user.getImageUrl())
                .isRestricted(user.isRestricted())
                .recentTemplates(user.getRecentTemplates())
                .build();
    }
}
