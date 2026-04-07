package com.industry.validation.controller;

import com.industry.validation.entity.Domain;
import com.industry.validation.service.DomainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/domains")
public class DomainController {

    @Autowired
    DomainService domainService;

    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        return ResponseEntity.ok(domainService.getAllDomains());
    }
}
