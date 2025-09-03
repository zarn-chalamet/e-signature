package com.digital.signature_sb.service;

import com.digital.signature_sb.model.RequestSignatureDocument;
import com.digital.signature_sb.model.UserDocument;

public interface EmailService {
    void sendEmail(UserDocument user, RequestSignatureDocument.Recipient recipient, RequestSignatureDocument document);
}
