package com.industry.validation.controller;

import com.industry.validation.dto.BookingRequest;
import com.industry.validation.entity.ValidationSession;
import com.industry.validation.security.services.UserDetailsImpl;
import com.industry.validation.service.ValidationSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    ValidationSessionService sessionService;

    @PostMapping("/book")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ValidationSession> bookSession(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody BookingRequest request) {
        return ResponseEntity.ok(sessionService.bookSession(userDetails.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ValidationSession>> getMySessions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        // Find role from authority mapping
        com.industry.validation.entity.Role role = userDetails.getAuthorities().stream()
                .findFirst().map(auth -> com.industry.validation.entity.Role.valueOf(auth.getAuthority().replace("ROLE_", "")))
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return ResponseEntity.ok(sessionService.getMySessions(userDetails.getId(), role));
    }
}
