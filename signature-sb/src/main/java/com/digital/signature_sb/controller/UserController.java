package com.digital.signature_sb.controller;

import com.digital.signature_sb.dto.UserDto;
import com.digital.signature_sb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("v1/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //create user
//    @PreAuthorize("hasRole('ADMIN_ROLE')")
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createNewUser(userDto);
        return ResponseEntity.ok(createdUser);
    }


    //get user profile(both USER_ROLE and ADMIN_ROLE can)
//    @PreAuthorize("hasAnyRole('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('USER_ROLE', 'ADMIN_ROLE')")
    public ResponseEntity<?> getAuthenticatedProfileData(Principal principal) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(principal.getName()));
    }

    //get all users (ONLY ADMIN_ROLE can)
    @GetMapping
//    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<List<UserDto>> getAllUser(Principal principal) {
        return ResponseEntity.ok(userService.getAllUsers(principal.getName()));
    }

    //toggle isRestricted (ONLY ADMIN_ROLE can)
    @PatchMapping("/{userId}/toggle-restrict")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<UserDto> toggleUserRestriction(@PathVariable String userId) {
        return ResponseEntity.ok(userService.toggleUserRestricted(userId));
    }

    // update user (ONLY ADMIN_ROLE can)
    @PatchMapping("/update/{userId}")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<UserDto> updateUser(@PathVariable String userId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUserById(userId,userDto));
    }

    // delete user (ONLY ADMIN_ROLE can)
    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.ok("User Deleted successfully.");
    }
}
