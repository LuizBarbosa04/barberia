package com.barberflow.api.dto;

public record PublicShopResponse(
    String slug,
    String name,
    String notice,
    String whatsapp,
    String address,
    boolean queueOpen
) {}
