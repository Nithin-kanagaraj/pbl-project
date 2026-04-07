package com.industry.validation.config;

import com.industry.validation.entity.Domain;
import com.industry.validation.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DomainRepository domainRepository;

    @Override
    public void run(String... args) throws Exception {
        if (domainRepository.count() == 0) {
            List<String> domains = Arrays.asList(
                    "Full Stack Development",
                    "Frontend Development",
                    "Backend Development",
                    "Java Development",
                    "Python Development",
                    "DevOps",
                    "Cloud Computing",
                    "Data Structures & Algorithms",
                    "System Design",
                    "Machine Learning",
                    "Database Engineering",
                    "Mobile App Development"
            );

            for (String domainName : domains) {
                Domain domain = new Domain();
                domain.setName(domainName);
                domainRepository.save(domain);
            }
        }
    }
}
