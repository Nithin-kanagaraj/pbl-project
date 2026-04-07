package com.industry.validation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "validation_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ValidationSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler", "slots"})
    private User candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "validator_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler", "slots"})
    private User validator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "domain_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Domain domain;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "validator"})
    private ValidatorSlot slot;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private String meetingLink;

    private LocalDateTime createdAt = LocalDateTime.now();
}
