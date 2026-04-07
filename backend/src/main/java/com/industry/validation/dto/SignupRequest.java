package com.industry.validation.dto;

import com.industry.validation.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    private List<Long> domainIds;

    // Validator specific optional fields
    private Integer yearsOfExperience;
    private String currentCompany;
    private String designation;
    private String bio;
    private String linkedInUrl;
}
