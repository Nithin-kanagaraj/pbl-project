package com.industry.validation.service;

import com.industry.validation.dto.SlotCreateRequest;
import com.industry.validation.entity.SlotStatus;
import com.industry.validation.entity.User;
import com.industry.validation.entity.ValidatorSlot;
import com.industry.validation.repository.UserRepository;
import com.industry.validation.repository.ValidatorSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ValidatorSlotService {
    
    @Autowired
    ValidatorSlotRepository validatorSlotRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public ValidatorSlot createSlot(Long validatorId, SlotCreateRequest request) {
        User validator = userRepository.findById(validatorId)
                .orElseThrow(() -> new RuntimeException("Validator not found"));

        ValidatorSlot slot = new ValidatorSlot();
        slot.setValidator(validator);
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setStatus(SlotStatus.AVAILABLE);

        return validatorSlotRepository.save(slot);
    }

    @Transactional(readOnly = true)
    public List<ValidatorSlot> getAvailableSlots(Long validatorId) {
        return validatorSlotRepository.findByValidatorIdAndStatus(validatorId, SlotStatus.AVAILABLE);
    }

    @Transactional(readOnly = true)
    public List<ValidatorSlot> getAvailableSlotsByDomain(Long domainId) {
        return validatorSlotRepository.findByStatusAndValidator_Domains_Id(SlotStatus.AVAILABLE, domainId);
    }

    @Transactional(readOnly = true)
    public List<ValidatorSlot> getAllSlots(Long validatorId) {
        return validatorSlotRepository.findByValidatorId(validatorId);
    }

    @Transactional
    public void deleteSlot(Long validatorId, Long slotId) {
        ValidatorSlot slot = validatorSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        if (!slot.getValidator().getId().equals(validatorId)) {
            throw new RuntimeException("Unauthorized to delete this slot");
        }
        
        validatorSlotRepository.delete(slot);
    }

    @Transactional
    public ValidatorSlot updateSlot(Long validatorId, Long slotId, SlotCreateRequest request) {
        ValidatorSlot slot = validatorSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        if (!slot.getValidator().getId().equals(validatorId)) {
            throw new RuntimeException("Unauthorized to update this slot");
        }
        
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        
        return validatorSlotRepository.save(slot);
    }
}
