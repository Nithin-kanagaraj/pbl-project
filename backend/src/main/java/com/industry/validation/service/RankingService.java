package com.industry.validation.service;

import com.industry.validation.dto.RankingResponse;
import com.industry.validation.entity.Evaluation;
import com.industry.validation.entity.User;
import com.industry.validation.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RankingService {

    @Autowired
    EvaluationRepository evaluationRepository;

    public List<RankingResponse> getRankingsByDomain(Long domainId) {
        List<Evaluation> evaluations = evaluationRepository.findByDomainId(domainId);

        // Group by Candidate
        Map<User, List<Evaluation>> evaluationsByCandidate = evaluations.stream()
                .collect(Collectors.groupingBy(eval -> eval.getSession().getCandidate()));

        List<RankingResponse> rankings = new ArrayList<>();

        for (Map.Entry<User, List<Evaluation>> entry : evaluationsByCandidate.entrySet()) {
            User candidate = entry.getKey();
            List<Evaluation> candidateEvals = entry.getValue();

            double avgScore = candidateEvals.stream()
                    .mapToDouble(Evaluation::getOverallScore)
                    .average()
                    .orElse(0.0);

            rankings.add(new RankingResponse(
                    candidate.getId(),
                    candidate.getName(),
                    candidate.getEmail(),
                    avgScore,
                    candidateEvals.size()
            ));
        }

        // Sort descending by score
        rankings.sort((r1, r2) -> Double.compare(r2.getAverageScore(), r1.getAverageScore()));

        return rankings;
    }
}
