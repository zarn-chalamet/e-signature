package com.digital.signature_sb.controller;

import com.digital.signature_sb.dto.LoginRequestDto;
import com.digital.signature_sb.security.jwt.JwtAuthResponse;
import com.digital.signature_sb.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
//        return ResponseEntity.ok(authService.authenticateUser(loginRequestDto));
        JwtAuthResponse jwtResponse = authService.authenticateUser(loginRequestDto);
        // Set JWT in response header
        response.setHeader("Authorization", "Bearer " + jwtResponse.getToken());
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate the token on the client side by setting an empty token with immediate expiration
        response.setHeader("Authorization", "");

        return ResponseEntity.ok().body(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }
}
