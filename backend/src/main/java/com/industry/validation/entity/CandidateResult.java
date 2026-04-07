package com.industry.validation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_results", indexes = {
    @Index(name = "idx_domain", columnList = "domain_id"),
    @Index(name = "idx_score", columnList = "score")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler", "slots"})
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ValidationSession session;

    private Double score;
    
    @Column(name = "`rank`")
    private Integer rank;
    
    private LocalDateTime completedAt;
}
