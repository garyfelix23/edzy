package com.revature.edzybackend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
    private JwtFilter jwtFilter;

    @Autowired
    public void setJwtFilter(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // csrf is used for browser session, since we're using jwt, so disabling it
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // making session stateless
                .authorizeHttpRequests(auth -> auth
                        // public endpoints - no authentication (login/register) needed
                        .requestMatchers("/api/auth/**").permitAll() // anyone can access
                        .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll() // anyone can access course

                        // instructor only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("INSTRUCTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasRole("INSTRUCTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("INSTRUCTOR")

                        // Student and Instructor needs to be authenticated before using this endpoint
                        .anyRequest().authenticated()  // everything needs JWT Token
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // runs the JwtFilter

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000", "http://edzy-frontend.s3-website.eu-north-1.amazonaws.com/"));  // React app URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // apply to all endpoints

        return source;
    }

    @Bean
    // this method used to hash passwords before saving
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(); // BCryptPasswordEncoder is a strong hashing algorithm
    }
}
