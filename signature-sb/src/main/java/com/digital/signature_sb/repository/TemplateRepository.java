package com.digital.signature_sb.repository;

import com.digital.signature_sb.model.TemplateDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TemplateRepository extends MongoRepository<TemplateDocument,String> {
}
