package com.industry.validation.service;

import com.industry.validation.dto.JwtResponse;
import com.industry.validation.dto.LoginRequest;
import com.industry.validation.dto.MessageResponse;
import com.industry.validation.dto.SignupRequest;
import com.industry.validation.entity.Domain;
import com.industry.validation.entity.User;
import com.industry.validation.repository.DomainRepository;
import com.industry.validation.repository.UserRepository;
import com.industry.validation.security.jwt.JwtUtils;
import com.industry.validation.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DomainRepository domainRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Transactional(readOnly = true)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        JwtResponse response = new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                user.getRole());

        // Include profile fields the frontend needs
        response.setYearsOfExperience(user.getYearsOfExperience());
        response.setCurrentCompany(user.getCurrentCompany());
        response.setDesignation(user.getDesignation());
        response.setBio(user.getBio());
        response.setLinkedInUrl(user.getLinkedInUrl());
        response.setDomains(user.getDomains());

        return response;
    }

    @Transactional
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());

        // Set validator‑specific optional fields (if provided)
        user.setYearsOfExperience(signUpRequest.getYearsOfExperience());
        user.setCurrentCompany(signUpRequest.getCurrentCompany());
        user.setDesignation(signUpRequest.getDesignation());
        user.setBio(signUpRequest.getBio());
        user.setLinkedInUrl(signUpRequest.getLinkedInUrl());

        if (signUpRequest.getDomainIds() != null && !signUpRequest.getDomainIds().isEmpty()) {
            Set<Domain> domains = new HashSet<>();
            for (Long domainId : signUpRequest.getDomainIds()) {
                Domain domain = domainRepository.findById(domainId)
                        .orElseThrow(() -> new RuntimeException("Error: Domain is not found."));
                domains.add(domain);
            }
            user.setDomains(domains);
        }

        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
}
