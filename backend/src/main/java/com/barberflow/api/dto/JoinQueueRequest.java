package com.barberflow.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record JoinQueueRequest(
    @NotBlank @Size(min = 2, max = 80) String name,
    @NotBlank @Pattern(regexp = "[0-9() +\\-]{10,20}", message = "Informe um telefone válido") String phone
) {}
