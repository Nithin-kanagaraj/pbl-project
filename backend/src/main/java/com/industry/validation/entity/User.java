package com.industry.validation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Validator specific profile fields (optional for non‑validators)
    private Integer yearsOfExperience;
    private String currentCompany;
    private String designation;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private String linkedInUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_domains",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "domain_id")
    )
    private Set<Domain> domains = new java.util.HashSet<>();

    @OneToMany(mappedBy = "validator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ValidatorSlot> slots = new ArrayList<>();
}
