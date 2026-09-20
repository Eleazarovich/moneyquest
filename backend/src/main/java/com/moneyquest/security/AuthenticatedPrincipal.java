package com.moneyquest.security;

public record AuthenticatedPrincipal(String subject, String kind) {
    public boolean isUser() { return "user".equals(kind); }
}
