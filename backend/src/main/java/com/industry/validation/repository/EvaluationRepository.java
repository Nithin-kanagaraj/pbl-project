package com.industry.validation.repository;

import com.industry.validation.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    @Query("SELECT e FROM Evaluation e JOIN e.session s WHERE s.domain.id = :domainId")
    List<Evaluation> findByDomainId(@Param("domainId") Long domainId);

    @Query("SELECT AVG(e.overallScore) FROM Evaluation e WHERE e.session.validator.id = :validatorId")
    Double calculateAverageRatingByValidatorId(@Param("validatorId") Long validatorId);

    @Query("SELECT e FROM Evaluation e WHERE e.session.candidate.id = :candidateId")
    List<Evaluation> findByCandidateId(@Param("candidateId") Long candidateId);

    Optional<Evaluation> findBySessionId(Long sessionId);
}
