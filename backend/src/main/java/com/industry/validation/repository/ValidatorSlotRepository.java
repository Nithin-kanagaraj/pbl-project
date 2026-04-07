package com.industry.validation.repository;

import com.industry.validation.entity.ValidatorSlot;
import com.industry.validation.entity.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ValidatorSlotRepository extends JpaRepository<ValidatorSlot, Long> {
    @Query("SELECT s FROM ValidatorSlot s WHERE s.validator.id = :validatorId AND s.status = :status")
    List<ValidatorSlot> findByValidatorIdAndStatus(@Param("validatorId") Long validatorId, @Param("status") SlotStatus status);

    @Query("SELECT s FROM ValidatorSlot s JOIN s.validator v JOIN v.domains d WHERE s.status = :status AND d.id = :domainId")
    List<ValidatorSlot> findByStatusAndValidator_Domains_Id(@Param("status") SlotStatus status, @Param("domainId") Long domainId);

    @Query("SELECT s FROM ValidatorSlot s WHERE s.validator.id = :validatorId")
    List<ValidatorSlot> findByValidatorId(@Param("validatorId") Long validatorId);
}
