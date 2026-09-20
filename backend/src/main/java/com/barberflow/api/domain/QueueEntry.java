package com.barberflow.api.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "queue_entries", indexes = {
    @Index(name = "idx_queue_tenant_status_created", columnList = "tenant_id,status,created_at")
})
public class QueueEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;
    @Column(nullable = false, length = 80)
    private String customerName;
    @Column(nullable = false, length = 25)
    private String phone;
    @Column(nullable = false, unique = true, length = 36)
    private String accessToken;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private QueueStatus status;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    private Instant calledAt;
    private Instant serviceStartedAt;
    private Instant finishedAt;

    protected QueueEntry() {}
    public QueueEntry(Tenant tenant, String customerName, String phone) {
        this.tenant = tenant;
        this.customerName = customerName.trim();
        this.phone = phone.replaceAll("\\D", "");
        this.accessToken = UUID.randomUUID().toString();
        this.status = QueueStatus.WAITING;
        this.createdAt = Instant.now();
    }
    public Long getId() { return id; }
    public Tenant getTenant() { return tenant; }
    public String getCustomerName() { return customerName; }
    public String getPhone() { return phone; }
    public String getAccessToken() { return accessToken; }
    public QueueStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
