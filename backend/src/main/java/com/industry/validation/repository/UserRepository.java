package com.industry.validation.repository;

import com.industry.validation.entity.User;
import com.industry.validation.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u JOIN u.domains d WHERE u.role = :role AND d.id = :domainId")
    List<User> findByRoleAndDomains_Id(@Param("role") Role role, @Param("domainId") Long domainId);
}
