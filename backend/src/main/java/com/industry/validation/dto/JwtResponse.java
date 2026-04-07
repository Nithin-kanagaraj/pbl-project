package com.industry.validation.dto;

import com.industry.validation.entity.Domain;
import com.industry.validation.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;

    // Validator specific fields
    private Integer yearsOfExperience;
    private String currentCompany;
    private String designation;
    private String bio;
    private String linkedInUrl;
    private Set<Domain> domains;

    public JwtResponse(String token, Long id, String name, String email, Role role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
