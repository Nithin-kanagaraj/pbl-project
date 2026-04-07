package com.industry.validation.service;

import com.industry.validation.dto.ValidatorProfileDTO;
import com.industry.validation.entity.Role;
import com.industry.validation.entity.SessionStatus;
import com.industry.validation.entity.User;
import com.industry.validation.repository.EvaluationRepository;
import com.industry.validation.repository.UserRepository;
import com.industry.validation.repository.ValidationSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ValidatorService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ValidationSessionRepository sessionRepository;

    @Autowired
    EvaluationRepository evaluationRepository;

    @Transactional(readOnly = true)
    public List<User> getValidatorsByDomain(Long domainId) {
        return userRepository.findByRoleAndDomains_Id(Role.VALIDATOR, domainId);
    }

    @Transactional(readOnly = true)
    public ValidatorProfileDTO getValidatorProfile(Long id) {
        User validator = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Validator not found"));

        if (validator.getRole() != Role.VALIDATOR) {
            throw new RuntimeException("User is not a validator");
        }

        // Calculate stats
        Long totalValidations = sessionRepository.countByValidatorIdAndStatus(id, SessionStatus.COMPLETED);
        
        // Calculate average rating from evaluations linked to this validator's sessions
        Double avgRating = evaluationRepository.calculateAverageRatingByValidatorId(id);
        if (avgRating == null) avgRating = 0.0;

        return new ValidatorProfileDTO(
                validator.getId(),
                validator.getName(),
                validator.getCurrentCompany(),
                validator.getDesignation(),
                validator.getYearsOfExperience(),
                validator.getBio(),
                validator.getDomains(),
                totalValidations,
                avgRating
        );
    }
}
