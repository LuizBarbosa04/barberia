package com.barberflow.api.dto;

import java.util.List;

public record QueueSnapshotResponse(
    boolean open,
    boolean paused,
    int averageWaitMinutes,
    List<QueuePersonResponse> people
) {}
