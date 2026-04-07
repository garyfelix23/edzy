package com.revature.edzybackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter { // we're extending OncePerRequestFilter to ensure filter runs once per request
    private JwtUtil jwtUtil;
    // injecting JwtUtil dependency using setter injection
    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // this method runs for every request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        // gets authorization header and looks for Authorization: Bearer <Token>
        String header = request.getHeader("Authorization");
        // checks header is valid and starts with Bearer
        if(header != null && header.startsWith("Bearer ")){
            // this removes the Bearer , so starts with index 7.
            String token = header.substring(7);
            // validates token using isValid() from jwtUtil and checks token is not expired
            if(jwtUtil.isValid(token)){
                // Gets the email id stored in token
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                // used to set role as authority -> ROLE_USER or ROLE_INSTRUCTOR
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

                // creating authentication object and tells the user is authenticated
                // working code
//                UsernamePasswordAuthenticationToken auth =
//                        new UsernamePasswordAuthenticationToken(
//                                email,
//                                null,
//                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
//                        );
                // this tells the spring that the user is authenticated.
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response); // this pass the request to next filter and controller
    }
}
