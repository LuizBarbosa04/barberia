package com.barberflow.api.config;

import com.barberflow.api.domain.Tenant;
import com.barberflow.api.repository.TenantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoDataConfig {
    @Bean
    @ConditionalOnProperty(name = "app.demo.enabled", havingValue = "true", matchIfMissing = true)
    CommandLineRunner demoTenant(TenantRepository tenants) {
        return args -> {
            if (tenants.findBySlug("denis").isPresent()) return;
            Tenant tenant = new Tenant("denis", "Denis Barber");
            tenant.setQueueOpen(true);
            tenant.setAverageServiceMinutes(30);
            tenant.setMaxQueueSize(20);
            tenant.setDailyNotice("Hoje atendemos das 11h às 19h.");
            tenant.setWhatsapp("5500000000000");
            tenant.setAddress("Rua da Barbearia, 100 — Centro");
            tenants.save(tenant);
        };
    }
}
