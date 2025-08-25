package com.digital.signature_sb.exception;

public class RequestSignatureDocumentNotAuthorizedException extends RuntimeException {
    public RequestSignatureDocumentNotAuthorizedException(String message) {
        super(message);
    }
}
