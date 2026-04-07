package com.industry.validation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RankingResponse {
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Double averageScore;
    private int sessionCount;
}
