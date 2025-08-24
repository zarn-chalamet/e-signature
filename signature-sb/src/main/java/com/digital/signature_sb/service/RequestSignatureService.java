package com.digital.signature_sb.service;

import com.digital.signature_sb.dto.RequestSignatureDtoForRequest;
import com.digital.signature_sb.dto.RequestSignatureDtoResponse;

import java.util.List;

public interface RequestSignatureService {
    RequestSignatureDtoResponse createRequestSignatureDocument(RequestSignatureDtoForRequest request, String email);

    List<RequestSignatureDtoResponse> getAllUserRequest(String email);

    RequestSignatureDtoResponse getRequestSignatureDocById(String requestId);

    List<RequestSignatureDtoResponse> getReceivedRequestsFromOthers(String email);
}
