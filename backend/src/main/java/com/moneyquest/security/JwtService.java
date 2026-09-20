package com.moneyquest.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final Duration expiration;

    public JwtService(@Value("${moneyquest.jwt.secret}") String secret,
                      @Value("${moneyquest.jwt.expiration}") Duration expiration) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("moneyquest.jwt.secret must contain at least 32 bytes");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public IssuedToken issue(String subject, String kind) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(expiration);
        String token = Jwts.builder()
            .subject(subject)
            .claim("kind", kind)
            .issuedAt(Date.from(issuedAt))
            .expiration(Date.from(expiresAt))
            .signWith(signingKey)
            .compact();
        return new IssuedToken(token, expiresAt);
    }

    public ParsedToken parse(String token) {
        try {
            Jws<Claims> parsed = Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token);
            String kind = parsed.getPayload().get("kind", String.class);
            if (kind == null || kind.isBlank()) return null;
            return new ParsedToken(parsed.getPayload().getSubject(), kind);
        } catch (JwtException | IllegalArgumentException exception) {
            return null;
        }
    }

    public record IssuedToken(String value, Instant expiresAt) { }
    public record ParsedToken(String subject, String kind) { }
}
