package com.industry.validation.service;

import com.industry.validation.dto.EvaluationRequest;
import com.industry.validation.entity.Evaluation;
import com.industry.validation.entity.SessionStatus;
import com.industry.validation.entity.ValidationSession;
import com.industry.validation.repository.EvaluationRepository;
import com.industry.validation.repository.ValidationSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationService {

    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    ValidationSessionRepository sessionRepository;

    @Transactional
    public Evaluation submitEvaluation(Long validatorId, EvaluationRequest request) {
        ValidationSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getValidator().getId().equals(validatorId)) {
            throw new RuntimeException("You are not authorized to evaluate this session");
        }

        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new RuntimeException("Session is already evaluated");
        }

        // Mark session as completed
        session.setStatus(SessionStatus.COMPLETED);
        sessionRepository.save(session);

        Evaluation evaluation = new Evaluation();
        evaluation.setSession(session);
        evaluation.setTechnicalScore(request.getTechnicalScore());
        evaluation.setCommunicationScore(request.getCommunicationScore());
        evaluation.setProblemSolvingScore(request.getProblemSolvingScore());
        evaluation.setFeedbackText(request.getFeedbackText());

        return evaluationRepository.save(evaluation);
    }
}
