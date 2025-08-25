package com.digital.signature_sb.exception;

public class UserAlreadySignedException extends RuntimeException {
    public UserAlreadySignedException(String message) {
        super(message);
    }
}
