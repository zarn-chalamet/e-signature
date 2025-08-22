package com.digital.signature_sb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/api/user")
public class UserController {

    @GetMapping("/hello")
    public ResponseEntity<?> sayHello(){
        return ResponseEntity.ok("hello zarn");
    }
}
