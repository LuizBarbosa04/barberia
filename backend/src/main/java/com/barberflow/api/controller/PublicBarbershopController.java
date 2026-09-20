package com.barberflow.api.controller;

import com.barberflow.api.dto.*;
import com.barberflow.api.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/barbershops/{slug}")
public class PublicBarbershopController {
    private final QueueService queueService;
    public PublicBarbershopController(QueueService queueService) { this.queueService = queueService; }

    @GetMapping
    public PublicShopResponse shop(@PathVariable String slug) { return queueService.shop(slug); }

    @GetMapping("/queue")
    public QueueSnapshotResponse queue(@PathVariable String slug) { return queueService.snapshot(slug); }

    @PostMapping("/queue")
    public JoinQueueResponse join(@PathVariable String slug, @Valid @RequestBody JoinQueueRequest request) {
        return queueService.join(slug, request);
    }
}
