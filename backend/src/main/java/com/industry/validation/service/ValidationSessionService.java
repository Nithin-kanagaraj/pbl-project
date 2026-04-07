package com.industry.validation.service;

import com.industry.validation.dto.BookingRequest;
import com.industry.validation.entity.*;
import com.industry.validation.repository.DomainRepository;
import com.industry.validation.repository.UserRepository;
import com.industry.validation.repository.ValidationSessionRepository;
import com.industry.validation.repository.ValidatorSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ValidationSessionService {

    @Autowired
    ValidationSessionRepository sessionRepository;

    @Autowired
    ValidatorSlotRepository slotRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DomainRepository domainRepository;

    @Transactional
    public ValidationSession bookSession(Long candidateId, BookingRequest request) {
        ValidatorSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Slot is already booked");
        }

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Domain domain = domainRepository.findById(request.getDomainId())
                .orElseThrow(() -> new RuntimeException("Domain not found"));

        // Mark slot as booked
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // Create session
        ValidationSession session = new ValidationSession();
        session.setCandidate(candidate);
        session.setValidator(slot.getValidator());
        session.setDomain(domain);
        session.setSlot(slot);
        session.setStatus(SessionStatus.SCHEDULED);
        session.setCreatedAt(LocalDateTime.now());

        return sessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<ValidationSession> getMySessions(Long userId, Role role) {
        if (role == Role.CANDIDATE) {
            return sessionRepository.findByCandidateId(userId);
        } else if (role == Role.VALIDATOR) {
            return sessionRepository.findByValidatorId(userId);
        }
        throw new RuntimeException("Role not authorized for this action");
    }
}
