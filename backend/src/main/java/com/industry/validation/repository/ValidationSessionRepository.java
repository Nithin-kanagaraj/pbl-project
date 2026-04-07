package com.industry.validation.repository;

import com.industry.validation.entity.ValidationSession;
import com.industry.validation.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ValidationSessionRepository extends JpaRepository<ValidationSession, Long> {
    List<ValidationSession> findByCandidateId(Long candidateId);
    List<ValidationSession> findByValidatorId(Long validatorId);
    Long countByValidatorIdAndStatus(Long validatorId, SessionStatus status);
}
