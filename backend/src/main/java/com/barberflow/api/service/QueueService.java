package com.barberflow.api.service;

import com.barberflow.api.domain.*;
import com.barberflow.api.dto.*;
import com.barberflow.api.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Set;

@Service
public class QueueService {
    private static final Set<QueueStatus> ACTIVE = Set.of(QueueStatus.WAITING, QueueStatus.CALLED, QueueStatus.IN_SERVICE);
    private final TenantRepository tenants;
    private final QueueEntryRepository entries;
    private final SimpMessagingTemplate messaging;

    public QueueService(TenantRepository tenants, QueueEntryRepository entries, SimpMessagingTemplate messaging) {
        this.tenants = tenants;
        this.entries = entries;
        this.messaging = messaging;
    }

    @Transactional(readOnly = true)
    public PublicShopResponse shop(String slug) {
        Tenant tenant = requireTenant(slug);
        return new PublicShopResponse(tenant.getSlug(), tenant.getName(), tenant.getDailyNotice(), tenant.getWhatsapp(), tenant.getAddress(), tenant.isQueueOpen());
    }

    @Transactional(readOnly = true)
    public QueueSnapshotResponse snapshot(String slug) {
        return snapshot(requireTenant(slug));
    }

    @Transactional
    public JoinQueueResponse join(String slug, JoinQueueRequest request) {
        Tenant tenant = tenants.findBySlugForUpdate(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barbearia não encontrada"));
        if (!tenant.isQueueOpen() || tenant.isQueuePaused()) throw new ResponseStatusException(HttpStatus.CONFLICT, "A fila não está aceitando novas entradas");
        long size = entries.countByTenantIdAndStatusIn(tenant.getId(), ACTIVE);
        if (size >= tenant.getMaxQueueSize()) throw new ResponseStatusException(HttpStatus.CONFLICT, "A fila atingiu o limite configurado");
        QueueEntry saved = entries.save(new QueueEntry(tenant, request.name(), request.phone()));
        QueueSnapshotResponse snapshot = snapshot(tenant);
        messaging.convertAndSend("/topic/barbershops/" + tenant.getSlug() + "/queue", snapshot);
        return new JoinQueueResponse(saved.getId(), anonymize(saved.getCustomerName()), snapshot.people().size(), saved.getAccessToken());
    }

    private QueueSnapshotResponse snapshot(Tenant tenant) {
        List<QueueEntry> active = entries.findByTenantIdAndStatusInOrderByCreatedAtAsc(tenant.getId(), ACTIVE);
        List<QueuePersonResponse> people = java.util.stream.IntStream.range(0, active.size())
            .mapToObj(index -> new QueuePersonResponse(active.get(index).getId(), anonymize(active.get(index).getCustomerName()), index + 1, active.get(index).getStatus().name()))
            .toList();
        int waiting = (int) active.stream().filter(entry -> entry.getStatus() == QueueStatus.WAITING).count();
        return new QueueSnapshotResponse(tenant.isQueueOpen(), tenant.isQueuePaused(), waiting * tenant.getAverageServiceMinutes(), people);
    }

    private Tenant requireTenant(String slug) {
        return tenants.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barbearia não encontrada"));
    }

    private String anonymize(String name) {
        String[] parts = name.trim().split("\\s+");
        return parts.length == 1 ? parts[0] : parts[0] + " " + parts[parts.length - 1].substring(0, 1).toUpperCase() + ".";
    }
}
