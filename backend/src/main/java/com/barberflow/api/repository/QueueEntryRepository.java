package com.barberflow.api.repository;

import com.barberflow.api.domain.QueueEntry;
import com.barberflow.api.domain.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {
    List<QueueEntry> findByTenantIdAndStatusInOrderByCreatedAtAsc(Long tenantId, Collection<QueueStatus> statuses);
    long countByTenantIdAndStatusIn(Long tenantId, Collection<QueueStatus> statuses);
}
