package com.digital.signature_sb.service;

import com.digital.signature_sb.dto.UserDto.UserDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    UserDto getCurrentUserProfile(String email);

    UserDto createNewUser(UserDto userDto);

    List<UserDto> getAllUsers(String email);

    UserDto toggleUserRestricted(String userId);

    UserDto updateUserById(String userId, UserDto userDto);

    void deleteUserById(String userId);
}
