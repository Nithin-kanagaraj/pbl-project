package com.industry.validation.controller;

import com.industry.validation.dto.ValidatorProfileDTO;
import com.industry.validation.entity.User;
import com.industry.validation.service.ValidatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/validators")
public class ValidatorController {

    @Autowired
    ValidatorService validatorService;

    @GetMapping
    public ResponseEntity<List<User>> getValidators(@RequestParam Long domainId) {
        return ResponseEntity.ok(validatorService.getValidatorsByDomain(domainId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ValidatorProfileDTO> getValidatorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(validatorService.getValidatorProfile(id));
    }
}
