package com.industry.validation.controller;

import com.industry.validation.dto.EvaluationRequest;
import com.industry.validation.entity.Evaluation;
import com.industry.validation.entity.ValidationSession;
import com.industry.validation.repository.EvaluationRepository;
import com.industry.validation.repository.ValidationSessionRepository;
import com.industry.validation.security.services.UserDetailsImpl;
import com.industry.validation.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    EvaluationService evaluationService;

    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    ValidationSessionRepository sessionRepository;

    @PostMapping
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<Evaluation> submitEvaluation(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody EvaluationRequest request) {
        return ResponseEntity.ok(evaluationService.submitEvaluation(userDetails.getId(), request));
    }

    /**
     * Candidate fetches their own evaluations/feedback.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<Evaluation>> getMyEvaluations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(evaluationRepository.findByCandidateId(userDetails.getId()));
    }

    /**
     * Validator starts evaluation for a session — generates a Google Meet link.
     */
    @PostMapping("/start/{sessionId}")
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<Map<String, String>> startEvaluation(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long sessionId) {

        try {
            ValidationSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

            if (!session.getValidator().getId().equals(userDetails.getId())) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Forbidden: you are not the validator for this session");
                return ResponseEntity.status(403).body(err);
            }

            // Generate a unique Google Meet-style link
            String meetCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
            String meetLink = "https://meet.google.com/" + meetCode.substring(0, 3) + "-"
                    + meetCode.substring(3, 7) + "-" + meetCode.substring(7);

            session.setMeetingLink(meetLink);
            sessionRepository.save(session);

            Map<String, String> result = new HashMap<>();
            result.put("meetingLink", meetLink);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}
