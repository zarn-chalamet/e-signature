package com.digital.signature_sb.service;

import com.digital.signature_sb.dto.LoginRequestDto;
import com.digital.signature_sb.dto.UserDto.UserDto;
import com.digital.signature_sb.security.jwt.JwtAuthResponse;

public interface AuthService{


    JwtAuthResponse authenticateUser(LoginRequestDto loginRequestDto);
}
