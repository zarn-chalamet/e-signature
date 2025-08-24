package com.digital.signature_sb.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistException.class)
    public ProblemDetail handleUserAlreadyExistException(UserAlreadyExistException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(TemplateNotFoundException.class)
    public ProblemDetail handleTemplateNotFoundException(TemplateNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(TemplateNotAuthorizedException.class)
    public ProblemDetail handleTemplateNotAuthorizedException(TemplateNotAuthorizedException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NON_AUTHORITATIVE_INFORMATION, e.getMessage());
    }

    @ExceptionHandler(RequestSignatureDocumentNotFoundException.class)
    public ProblemDetail handleRequestSignatureDocumentNotFoundException(RequestSignatureDocumentNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }
}
