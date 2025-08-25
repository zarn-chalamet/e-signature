package com.digital.signature_sb.exception;

public class NoPdfVersionsFoundException extends RuntimeException{
    public NoPdfVersionsFoundException(String message){
        super(message);
    }
}
