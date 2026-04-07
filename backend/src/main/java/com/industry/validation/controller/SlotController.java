package com.industry.validation.controller;

import com.industry.validation.dto.SlotCreateRequest;
import com.industry.validation.entity.ValidatorSlot;
import com.industry.validation.security.services.UserDetailsImpl;
import com.industry.validation.service.ValidatorSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    ValidatorSlotService slotService;

    @PostMapping
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<ValidatorSlot> createSlot(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody SlotCreateRequest request) {
        return ResponseEntity.ok(slotService.createSlot(userDetails.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<ValidatorSlot>> getSlots(@RequestParam(required = false) Long validatorId, @RequestParam(required = false) Long domainId, @RequestParam(required = false) Boolean available) {
        if (domainId != null) {
            return ResponseEntity.ok(slotService.getAvailableSlotsByDomain(domainId));
        } else if (validatorId != null) {
            if (Boolean.TRUE.equals(available)) {
                return ResponseEntity.ok(slotService.getAvailableSlots(validatorId));
            } else {
                return ResponseEntity.ok(slotService.getAllSlots(validatorId));
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<ValidatorSlot> updateSlot(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id, @RequestBody SlotCreateRequest request) {
        return ResponseEntity.ok(slotService.updateSlot(userDetails.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VALIDATOR')")
    public ResponseEntity<?> deleteSlot(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        slotService.deleteSlot(userDetails.getId(), id);
        return ResponseEntity.ok().build();
    }
}
