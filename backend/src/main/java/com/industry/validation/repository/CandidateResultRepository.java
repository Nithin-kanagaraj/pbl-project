package com.industry.validation.repository;

import com.industry.validation.entity.CandidateResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateResultRepository extends JpaRepository<CandidateResult, Long> {

    @Query(value = "SELECT id, candidate_id, domain_id, session_id, score, " +
                   "RANK() OVER (PARTITION BY domain_id ORDER BY score DESC, completed_at ASC) as `rank`, " +
                   "completed_at FROM candidate_results WHERE domain_id = :domainId", nativeQuery = true)
    List<CandidateResult> findRankedByDomainId(@Param("domainId") Long domainId);

    List<CandidateResult> findByDomainIdOrderByScoreDescCompletedAtAsc(Long domainId);

    Optional<CandidateResult> findBySessionId(Long sessionId);

    List<CandidateResult> findByCandidateId(Long candidateId);
}
