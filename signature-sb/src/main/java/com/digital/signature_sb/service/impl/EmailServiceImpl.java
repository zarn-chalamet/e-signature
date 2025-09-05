package com.digital.signature_sb.service.impl;

import com.digital.signature_sb.model.RequestSignatureDocument;
import com.digital.signature_sb.model.UserDocument;
import com.digital.signature_sb.repository.UserRepository;
import com.digital.signature_sb.service.EmailService;
import com.digital.signature_sb.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final UserRepository userRepository;

    @Override
    public void sendEmail(UserDocument currentUser, RequestSignatureDocument.Recipient recipient, RequestSignatureDocument document) {

        // Get recipient user
        UserDocument toEmailUser = userRepository.findById(recipient.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with userId : "+ recipient.getUserId()));

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String frontendLink = "http://localhost:5173/received/" + document.getId();

            String emailContent = "<!DOCTYPE html>"
                    + "<html>"
                    + "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">"
                    + "<div style=\"max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;\">"
                    + "<h2 style=\"color: #4CAF50;\">Signature Request Notification</h2>"
                    + "<p>Hi " + toEmailUser.getFirstName() + ",</p>"
                    + "<p><strong>" + currentUser.getFirstName() + " " + currentUser.getLastName() + "</strong> has requested you to sign a document.</p>"
                    + "<p><strong>Title:</strong> " + document.getTitle() + "</p>"
                    + "<p><strong>Message:</strong> " + document.getEmailMessage() + "</p>"
                    + "<div style=\"margin: 30px 0; text-align: center;\">"
                    + "<a href=\"" + frontendLink + "\" style=\"background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;\">Sign Document</a>"
                    + "</div>"
                    + "<p>If the button doesn’t work, copy and paste the link below into your browser:</p>"
                    + "<p><a href=\"" + frontendLink + "\">" + frontendLink + "</a></p>"
                    + "<hr>"
                    + "<p style=\"font-size: 12px; color: #999;\">This is an automated email, please do not reply.</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            helper.setText(emailContent, true);
            helper.setFrom("zarnn872@gmail.com", "Customer Support");
            helper.setSubject(document.getEmailSubject());
            helper.setTo(toEmailUser.getEmail());

            javaMailSender.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
