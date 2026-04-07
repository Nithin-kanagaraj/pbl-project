package com.industry.validation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluationRequest {
    private Long sessionId;
    private Integer technicalScore;
    private Integer communicationScore;
    private Integer problemSolvingScore;
    private String feedbackText;
}
