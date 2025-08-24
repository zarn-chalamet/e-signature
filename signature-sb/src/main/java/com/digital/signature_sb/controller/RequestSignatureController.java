package com.digital.signature_sb.controller;

import com.digital.signature_sb.dto.RequestSignatureDtoForRequest;
import com.digital.signature_sb.dto.RequestSignatureDtoResponse;
import com.digital.signature_sb.service.RequestSignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/v1/api/requests")
@RequiredArgsConstructor
public class RequestSignatureController {

    private final RequestSignatureService requestSignatureService;

    //create request signature (Both USER and ADMIN can)
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody RequestSignatureDtoForRequest request, Principal principal) {

        String email = principal.getName();
        RequestSignatureDtoResponse response = requestSignatureService.createRequestSignatureDocument(request, email);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //get user's request lists
    @GetMapping("/my-requests")
    public ResponseEntity<List<RequestSignatureDtoResponse>> getUserRequests(Principal principal) {

        String email = principal.getName();
        List<RequestSignatureDtoResponse> requestDocList = requestSignatureService.getAllUserRequest(email);

        return ResponseEntity.ok(requestDocList);
    }

    //get request by id
    @GetMapping("/{requestId}")
    public ResponseEntity<RequestSignatureDtoResponse> getRequestSignatureById(@PathVariable String requestId) {

        return ResponseEntity.ok(requestSignatureService.getRequestSignatureDocById(requestId));
    }

    //get requests that have been received from other users
    @GetMapping("/received-requests")
    public ResponseEntity<List<RequestSignatureDtoResponse>> getReceivedRequests(Principal principal) {

        String email = principal.getName();
        List<RequestSignatureDtoResponse> receivedDocList = requestSignatureService.getReceivedRequestsFromOthers(email);

        return ResponseEntity.ok(receivedDocList);
    }
}
