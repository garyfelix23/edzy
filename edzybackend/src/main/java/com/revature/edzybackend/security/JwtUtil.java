package com.revature.edzybackend.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET; // this is used to sign the token
    private final long EXPIRY = 1000 * 60 * 60 * 24;  // TOKEN expires after 24 hours

    // this method converts the SECRET string into Cryptographic key (uses HMAC SHA Algorithm)
    private Key getKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // to generate token
    public String generateToken(String email, String role){
        return Jwts.builder() // this helps to construct HEADER.PAYLOAD.SIGNATURE
                    .setSubject(email)  // stores user's email id inside token
                    .claim("role", role)
                    .setIssuedAt(new Date()) // when token is created
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRY))  // Token expiry time (after 24 hours)
                    .signWith(getKey(), SignatureAlgorithm.HS256) // sign in with secret key and algorithm
                    .compact(); // converts everything into JWT String
    }

    // input: token output: email stored in token
    public String extractEmail(String token){
        return Jwts.parserBuilder()  // reads the token
                    .setSigningKey(getKey())  // uses secret key and verifies token signature
                    .build()
                    .parseClaimsJws(token) // this checks the 1. validation signature 2. Check Expiration 3. Decodes Payload (if anything is wrong, then exception)
                    .getBody() // return data inside the token like { "sub": "user@example.com", "iat": 1710000000, "exp": 1710086400 }
                    .getSubject(); // atlast, it extracts the final email
    }

    public String extractRole(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // tries to parse the token, if no exception is raised, then extracts the email from token and returns true.
    // else, if the token is expired or tampered, the exception is thrown and returns false.
    public boolean isValid(String token){
        try{
            extractEmail(token);
            return true;
        }catch(JwtException e){
            return false;
        }
    }
}
