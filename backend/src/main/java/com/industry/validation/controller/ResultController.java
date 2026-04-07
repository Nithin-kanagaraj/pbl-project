package com.industry.validation.controller;

import com.industry.validation.entity.CandidateResult;
import com.industry.validation.repository.CandidateResultRepository;
import com.industry.validation.service.CandidateResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private CandidateResultService resultService;

    @Autowired
    private CandidateResultRepository resultRepository;

    @PostMapping("/complete-validation")
    @PreAuthorize("hasAnyRole('VALIDATOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<CandidateResult> completeValidation(@RequestBody Map<String, Long> payload) {
        Long sessionId = payload.get("sessionId");
        return ResponseEntity.ok(resultService.completeValidationAndScore(sessionId));
    }

    // GET /candidate-result/:id -> Return score + rank
    @GetMapping("/candidate-result/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'VALIDATOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<CandidateResult>> getCandidateResult(@PathVariable Long id) {
        // Here id is candidateId as per requirement "Return score + rank" for candidate
        // Could be multiple results but usually one. We'll return the list of their results.
        return ResponseEntity.ok(resultRepository.findByCandidateId(id));
    }

    // GET /recruiter/domain/:domainId -> Return ranked candidate list
    @GetMapping("/recruiter/domain/{domainId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN', 'CANDIDATE', 'VALIDATOR')")
    public ResponseEntity<List<CandidateResult>> getRankedCandidatesByDomain(@PathVariable Long domainId) {
        return ResponseEntity.ok(resultRepository.findByDomainIdOrderByScoreDescCompletedAtAsc(domainId));
    }
}
