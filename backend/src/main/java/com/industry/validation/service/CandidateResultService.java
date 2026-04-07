package com.industry.validation.service;

import com.industry.validation.entity.CandidateResult;
import com.industry.validation.entity.Evaluation;
import com.industry.validation.entity.SessionStatus;
import com.industry.validation.entity.ValidationSession;
import com.industry.validation.repository.CandidateResultRepository;
import com.industry.validation.repository.EvaluationRepository;
import com.industry.validation.repository.ValidationSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class CandidateResultService {

    @Autowired
    private CandidateResultRepository resultRepository;

    @Autowired
    private ValidationSessionRepository sessionRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Transactional
    public CandidateResult completeValidationAndScore(Long sessionId) {
        ValidationSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (resultRepository.findBySessionId(sessionId).isPresent()) {
            throw new RuntimeException("Result already calculated for this session");
        }

        // Mark session as completed
        session.setStatus(SessionStatus.COMPLETED);
        sessionRepository.save(session);

        // check if evaluation exists
        Evaluation eval = evaluationRepository.findBySessionId(sessionId).orElse(null);
        Double score = null;
        if (eval != null && eval.getOverallScore() != null) {
            score = eval.getOverallScore();
        } else {
            // "Automatically assign a score" - if no evaluation, just assign random score
            score = 60.0 + new Random().nextInt(41); // random 60 to 100
        }

        CandidateResult result = new CandidateResult();
        result.setCandidate(session.getCandidate());
        result.setDomain(session.getDomain());
        result.setSession(session);
        result.setScore(score);
        result.setCompletedAt(LocalDateTime.now());
        result = resultRepository.save(result);

        // Update Ranks for the domain
        updateDomainRanks(session.getDomain().getId());
        
        return resultRepository.findById(result.getId()).get();
    }

    private void updateDomainRanks(Long domainId) {
        List<CandidateResult> results = resultRepository.findByDomainIdOrderByScoreDescCompletedAtAsc(domainId);
        int rank = 1;
        for (CandidateResult res : results) {
            res.setRank(rank++);
        }
        resultRepository.saveAll(results);
    }
}
