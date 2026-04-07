package com.industry.validation.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ValidationSession session;

    private Integer technicalScore;
    private Integer communicationScore;
    private Integer problemSolvingScore;
    
    private Double overallScore; 

    @Column(length = 2000)
    private String feedbackText;

    @PrePersist
    @PreUpdate
    public void calculateOverall() {
        if (technicalScore != null && communicationScore != null && problemSolvingScore != null) {
            this.overallScore = (technicalScore + communicationScore + problemSolvingScore) / 3.0;
        }
    }
}
