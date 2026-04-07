package com.industry.validation;

import com.industry.validation.entity.ValidatorSlot;
import com.industry.validation.repository.ValidatorSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TestRunner implements CommandLineRunner {

    @Autowired
    ValidatorSlotRepository slotRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========== TEST RUNNER ==========");
        List<ValidatorSlot> all = slotRepository.findAll();
        System.out.println("TOTAL SLOTS IN DB: " + all.size());
        
        for (ValidatorSlot s : all) {
            System.out.println("Slot ID: " + s.getId() + " Validator ID: " + (s.getValidator() != null ? s.getValidator().getId() : "NULL") + " Date: " + s.getDate() + " StartTime: " + s.getStartTime() + " EndTime: " + s.getEndTime());
        }
    }
}
