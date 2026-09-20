package com.barberflow.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "tenants")
public class Tenant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 80)
    private String slug;
    @Column(nullable = false, length = 120)
    private String name;
    @Column(nullable = false)
    private boolean queueOpen;
    @Column(nullable = false)
    private boolean queuePaused;
    @Column(nullable = false)
    private int averageServiceMinutes = 30;
    @Column(nullable = false)
    private int maxQueueSize = 20;
    @Column(length = 240)
    private String dailyNotice;
    @Column(length = 30)
    private String whatsapp;
    @Column(length = 180)
    private String address;

    protected Tenant() {}
    public Tenant(String slug, String name) { this.slug = slug; this.name = name; }
    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public boolean isQueueOpen() { return queueOpen; }
    public boolean isQueuePaused() { return queuePaused; }
    public int getAverageServiceMinutes() { return averageServiceMinutes; }
    public int getMaxQueueSize() { return maxQueueSize; }
    public String getDailyNotice() { return dailyNotice; }
    public String getWhatsapp() { return whatsapp; }
    public String getAddress() { return address; }
    public void setQueueOpen(boolean queueOpen) { this.queueOpen = queueOpen; }
    public void setQueuePaused(boolean queuePaused) { this.queuePaused = queuePaused; }
    public void setAverageServiceMinutes(int value) { this.averageServiceMinutes = value; }
    public void setMaxQueueSize(int value) { this.maxQueueSize = value; }
    public void setDailyNotice(String value) { this.dailyNotice = value; }
    public void setWhatsapp(String value) { this.whatsapp = value; }
    public void setAddress(String value) { this.address = value; }
}
