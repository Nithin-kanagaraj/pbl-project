package com.industry.validation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Set;
import com.industry.validation.entity.Domain;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValidatorProfileDTO {
    private Long id;
    private String name;
    private String currentCompany;
    private String designation;
    private Integer yearsOfExperience;
    private String bio;
    private Set<Domain> domains;
    
    private Long totalValidationsCompleted;
    private Double averageRating;
}
