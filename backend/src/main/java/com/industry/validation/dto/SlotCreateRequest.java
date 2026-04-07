package com.industry.validation.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class SlotCreateRequest {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
