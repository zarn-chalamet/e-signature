package com.digital.signature_sb.repository;

import com.digital.signature_sb.model.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDocument,String> {
    UserDocument findByEmail(String email);
}
