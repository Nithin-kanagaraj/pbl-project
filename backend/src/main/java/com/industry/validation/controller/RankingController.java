package com.industry.validation.controller;

import com.industry.validation.dto.RankingResponse;
import com.industry.validation.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    @Autowired
    RankingService rankingService;

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<RankingResponse>> getRankings(@RequestParam Long domainId) {
        return ResponseEntity.ok(rankingService.getRankingsByDomain(domainId));
    }
}
