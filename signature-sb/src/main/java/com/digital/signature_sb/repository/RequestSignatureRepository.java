package com.digital.signature_sb.repository;

import com.digital.signature_sb.model.RequestSignatureDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestSignatureRepository extends MongoRepository<RequestSignatureDocument,String> {
    List<RequestSignatureDocument> findAllBySenderId(String id);
}
